"""
Forgot related views module for linklink app
"""

from datetime import datetime, timedelta
import json
from json.decoder import JSONDecodeError

from django.conf import settings
from django.contrib.auth.models import User
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    JsonResponse,
)

from ..decorators import allowed_method_or_405
from ..models import (
    LinkLinkUser,
    Verification,
)
from ..utils import is_expired, send_password_email

#--------------------------------------------------------------------------
#   Forgot Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET"])
def forgot_username(request, email):
    if request.method == "GET": # pragma: no branch
        try:
            linklinkuser_found = LinkLinkUser.objects.get(email_unique=email)
        except LinkLinkUser.DoesNotExist:
            return JsonResponse(
                status=404,
                data={"message": f"user not found for given email {email}"}
            )
        username_found = linklinkuser_found.user.username
        return JsonResponse(
            status=200,
            data={"username":username_found}
        )


@allowed_method_or_405(["POST", "PUT"])
def forgot_password(request):
    if request.method == "POST":
        # 1. Find user’s email based on username
        # 2. Get or create Verification with purpose=”Password”
        # 3. Set its expiresAt to suitable time range
        # 4. Send email to user, including url with token
        try:
            req_data = json.loads(request.body.decode())
            username = req_data["username"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
        # 1. Find user’s email based on username
        try:
            user_found = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse(
                status=404,
                data={
                    "message":
                    f"user not found for given username {username}"
                }
            )
        linklinuser_found = user_found.linklinkuser
        email_found = linklinuser_found.email_unique
        # 2. Get or create Verification with purpose=”Password”
        verification_password, _ = Verification.objects.get_or_create(
            linklinkuser=linklinuser_found,
            purpose="Password",
            expiresAt=datetime.now(),
        )
        # 3. Set its expiresAt to suitable time range
        expire_time = datetime.now() + \
            timedelta(hours=settings.PASSWORD_RESET_EXPIRE_HOURS)
        verification_password.expiresAt = expire_time
        verification_password.save()
        # 4. Send email to user, including url with token
        send_password_email(
            email_found,
            str(verification_password.token)
        )
        return HttpResponse(status=200)
    elif request.method == "PUT": # pragma: no branch
        # Given password reset Verification token and new password,
        # verity token and reset password
        try:
            req_data = json.loads(request.body.decode())
            token = req_data["token"]
            new_password = req_data["newPassword"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
        # Find User for given token
        try:
            verification_found = Verification.objects.get(token=token)
            user_found = verification_found.linklinkuser.user
        except (
            Verification.DoesNotExist,
            LinkLinkUser.DoesNotExist,
            User.DoesNotExist):
            return JsonResponse(
                status=404,
                data={
                    "message":
                    f"user not found for given token {token}"
                }
            )
        # Verify token
        if is_expired(verification_found.expiresAt): # pragma: no branch
            return JsonResponse(
                status=401,
                data={"message":"Token Expired"}
            )
        # Reset Password
        user_found.set_password(new_password)
        user_found.save()
        return HttpResponse(status=200)
