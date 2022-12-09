"""
Auth related views module for linklink app
"""

from datetime import datetime, timedelta
import json
from json.decoder import JSONDecodeError

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    JsonResponse
)
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie

from ..decorators import allowed_method_or_405, logged_in_or_401
from ..models import (
    LinkLinkUser,
    Verification,
    Profile,
)
from ..utils import send_register_email, is_expired

#--------------------------------------------------------------------------
#   Setting constants
#--------------------------------------------------------------------------

EMAIL_EXPIRE_DAYS = settings.EMAIL_EXPIRE_DAYS

#--------------------------------------------------------------------------
#   Auth Related APIs
#--------------------------------------------------------------------------

@ensure_csrf_cookie
def csrf_token(request):
    """
    Returns csrf token
    """
    if request.method == "GET":
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["GET"])


@allowed_method_or_405(["POST"])
def signup(request):
    """
    When user enters required info and requests signup,
    1. Create django User object
    2. Create LinkLinkUser object with emailValidated=False
    3. Create Verification object
    4. Create Profile object
    5. Send register email to linklinkuser.email_unique
    """
    try:
        req_data = json.loads(request.body.decode())
        username = req_data["username"]
        password = req_data["password"]
        email = req_data["email"]
        firstname = req_data["firstname"]
        lastname = req_data["lastname"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    # Create django User object
    user = User.objects.create_user(
        username=username,
        password=password,
        #email=email, email will be added not in User, but LinkLinkUser
        first_name=firstname,
        last_name=lastname
    )
    # Create LinkLinkUser object with emailValidated=False
    linklinkuser = LinkLinkUser.objects.create(
        user=user,
        emailValidated=False,
        email_unique = email
    )
    # Create Verification object
    expire_time = datetime.now() + timedelta(days=EMAIL_EXPIRE_DAYS)
    kst_tz = timezone.get_default_timezone()
    expire_time= expire_time.astimezone(kst_tz)
    verification = Verification.objects.create(
        linklinkuser=linklinkuser,
        purpose="Register",
        expiresAt=expire_time
    )
    # Create Profile object
    Profile.objects.create(
        linklinkuser=linklinkuser,
        introduction=f"안녕하세요, {linklinkuser}입니다."
    )
    # Send register email to linklinkuser.email_unique
    send_register_email(
        recipient=linklinkuser.email_unique,
        token=str(verification.token)
    )
    return HttpResponse(status=201)


@allowed_method_or_405(["POST"])
def signin(request):
    """
    When user enters username and password,
    1. Validate whether username + password exists
    2-1. If emailValidated, login
    2-2. Else, find token and resend register email
    """
    try:
        req_data = json.loads(request.body.decode())
        username = req_data["username"]
        password = req_data["password"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    # Validate whether username + password exists
    user = authenticate(username=username, password=password)
    if user is not None:
        # If emailValidated, login
        if user.linklinkuser.emailValidated:
            login(request, user)
            response_dict = {
                "id": user.linklinkuser.id,
                "email": user.linklinkuser.email_unique,
                "username": user.username,
                "firstname": user.first_name,
                "lastname": user.last_name,
            }
            return JsonResponse(
                status=200,
                data=response_dict
            )
        # Else, find token and resend register email
        else:
            # Find Verification object
            verification_found = Verification.objects.get(
                linklinkuser=user.linklinkuser
            )
            if is_expired(verification_found.expiresAt):
                # Update expiration if it has expired
                kst_tz = timezone.get_default_timezone()
                new_expire_time = \
                    datetime.now() + timedelta(days=EMAIL_EXPIRE_DAYS)
                new_expire_time = new_expire_time.astimezone(kst_tz)
                verification_found.expiresAt = new_expire_time
                verification_found.save()
            # Resend register email
            send_register_email(
                user.linklinkuser.email_unique,
                str(verification_found.token)
            )
            resent_email_message = (
                f"Account {username} exists, but is not validated. "
                "A validation email has been resent to "
                f"{user.linklinkuser.email_unique}."
            )
            return JsonResponse(
                status=403,
                data={"message": resent_email_message}
            )
    else: # login failed: incorrect info
        return JsonResponse(
            status=401,
            data={"message": "incorrect username or password."}
        )


@allowed_method_or_405(["GET"])
@logged_in_or_401
def signout(request):
    logout(request) # log the user out, clear django session
    return HttpResponse(status=204)


@allowed_method_or_405(["GET"])
# pylint: disable=unused-argument
def verify(request, token):
    """
    When user clicks link from email,
    1. Find Verification object with token=token
    2-1. If Register: check token expire, set user's emailValidated as True
    2-2. Elif Password: TODO
    """
    # Find Verification object with token=token
    verification_found = get_object_or_404(Verification, token=token)
    # Register: check token expire, set user's emailValidated as True
    if verification_found.purpose == "Register": # pragma: no branch
        if is_expired(verification_found.expiresAt):
            return JsonResponse(
                status=401, # Unauthorized
                data={"message":"Token Expired"}
            )
        else:
            verification_found.linklinkuser.emailValidated = True
            verification_found.linklinkuser.save()
    # elif verification_found.purpose == "Password":
    #     pass
    return JsonResponse({"message":"Successfully verified"})


@allowed_method_or_405(["GET"])
def auto_signin(request):
    if request.user.is_authenticated: # logged in
        response_dict = {
            "id": request.user.linklinkuser.id,
            "email": request.user.linklinkuser.email_unique,
            "username": request.user.username,
            "firstname": request.user.first_name,
            "lastname": request.user.last_name,
        }
        return JsonResponse(
            status=200,
            data=response_dict
        )
    else: # not logged in
        return HttpResponse(status=401) # unauthorized

@allowed_method_or_405(["POST"])
def check_email_unique(request):
    try:
        req_data = json.loads(request.body.decode())
        email = req_data["email"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    try:
        LinkLinkUser.objects.get(email_unique=email)
    except LinkLinkUser.DoesNotExist:
        return HttpResponse(status=200)
    return HttpResponse(status=409) # conflict

@allowed_method_or_405(["POST"])
def check_username_unique(request):
    try:
        req_data = json.loads(request.body.decode())
        username = req_data["username"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    try:
        User.objects.get(username=username)
    except User.DoesNotExist:
        return HttpResponse(status=200)
    return HttpResponse(status=409) # conflict
