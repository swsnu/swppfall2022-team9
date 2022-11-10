"""
views module for linklink app
"""

from datetime import datetime, timedelta
import json
from json.decoder import JSONDecodeError
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.db.models import Q
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    JsonResponse
)
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie

from .decorators import allowed_method_or_405, logged_in_or_401
from .models import LinkLinkUser, FriendRequest, Verification

#--------------------------------------------------------------------------
#   Setting constants
#--------------------------------------------------------------------------

HOMEPAGE_URL = settings.HOMEPAGE_URL
EMAIL_HOST_USER = settings.EMAIL_HOST_USER
EMAIL_EXPIRE_DAYS = settings.EMAIL_EXPIRE_DAYS

#--------------------------------------------------------------------------
#   Helper Functions
#--------------------------------------------------------------------------

def send_register_email(
    recipient,
    token,
    title="이메일 인증",
    message="회원가입을 하려면 이메일 인증을 진행해주세요"):
    """
    Helper function to send register email to recipient

    Args:
    recipient: str, email address
    title: str, title
    message: str, message
    token: str, register verification token
    Return:
    None
    """
    context = {
        "subject": title,
        "message": message,
        "button_link": os.path.join(HOMEPAGE_URL, "verify", token) + "/",
    }
    html_mail = render_to_string("linklink/register_email.html", context)
    send_mail(
        subject=title,
        message=message,
        from_email=EMAIL_HOST_USER,
        recipient_list=[recipient],
        html_message=html_mail
    )


def is_expired(query_time):
    """
    Helper function to determine whether query_time is expired

    Args:
    query_time: datetime, time to check expiration
    Returns:
    boolean
    """
    kst_tz = timezone.get_default_timezone()
    # Align timezone to KST(Korea Standard Time) for fair comparison
    token_expire_time= query_time.astimezone(kst_tz)
    time_now = datetime.now().astimezone(kst_tz)
    return time_now > token_expire_time


def get_onechon_linklinkuser_list(
    queryset,
    linklinkuser,
    exclude_linklinkuser=None):
    """
    Helper function to get all onechon of given linklinkuser

    Args:
    queryset: queryset of FriendRequest
    linklinkuser: LinkLinkUser for search
    exclude_linklinkuser: LinkLinkUser to exclude from final result
    Return:
    List[LinkLinkUser]
    """
    accepted_friend_requests = queryset.filter(
        Q(senderId=linklinkuser) | Q(getterId=linklinkuser)
    )
    onechon_list = []
    for accepted_friend_request in accepted_friend_requests:
        onechon_list.append(accepted_friend_request.senderId)
        onechon_list.append(accepted_friend_request.getterId)
    # remove duplicates
    onechon_list = set(onechon_list)
    if onechon_list: # pragma: no branch
        onechon_list.remove(linklinkuser)
    # exclude exclude_linklinkuser
    if exclude_linklinkuser is not None:
        onechon_list.remove(exclude_linklinkuser)
    return list(onechon_list)

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
    4. Send register email to linklinkuser.email_unique
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
                "id": user.id,
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
                status=401,
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


#--------------------------------------------------------------------------
#   LinkLinkUser Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET", "POST", "DELETE"])
@logged_in_or_401
def friend(request):
    if request.method == "GET": # pragma: no branch
        # Get all Accepted FriendRequest
        all_accepted_friend_requests = FriendRequest.objects.filter(
            status="Accepted"
        )
        # Get onechon of current user
        onechon_list = get_onechon_linklinkuser_list(
            all_accepted_friend_requests,
            request.user.linklinkuser
        )
        response_dict = {"friendList": []} # Nested dict
        for onechon_linklinkuser in onechon_list:
            # Construct onechon_dict
            onechon_dict = {}
            onechon_dict["id"] = onechon_linklinkuser.user.id
            onechon_dict["firstname"] = onechon_linklinkuser.user.first_name
            onechon_dict["lastname"] = onechon_linklinkuser.user.last_name
            onechon_dict["imgUrl"] = onechon_linklinkuser.imgUrl
            onechon_dict["chons"] = []
            twochon_list = get_onechon_linklinkuser_list(
                all_accepted_friend_requests,
                onechon_linklinkuser,
                exclude_linklinkuser=request.user.linklinkuser
            )
            for twochon_linklinkuser in twochon_list:
                # for linklinkuser who is both onechon AND twochon,
                # count the user as onechon!
                if twochon_linklinkuser not in onechon_list:
                    # Construct twochon_dict
                    twochon_dict = {}
                    twochon_dict["id"] = twochon_linklinkuser.user.id
                    twochon_dict["firstname"] = \
                        twochon_linklinkuser.user.first_name
                    twochon_dict["lastname"] = \
                        twochon_linklinkuser.user.last_name
                    twochon_dict["imgUrl"] = twochon_linklinkuser.imgUrl
                    # Append constructed twochon_dict
                    onechon_dict["chons"].append(twochon_dict)
            # Append constructed onechon_dict
            response_dict["friendList"].append(onechon_dict)
        return JsonResponse(response_dict) # implicit status code = 200
    # elif request.method == "POST":
    #     pass
    # elif request.method == "DELETE":
    #     pass
    