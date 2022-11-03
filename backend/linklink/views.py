"""
views module for linklink app
"""

import json
from json.decoder import JSONDecodeError
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed
)
from django.template.loader import render_to_string
from django.views.decorators.csrf import ensure_csrf_cookie
import requests

from .decorators import allowed_method_or_405, logged_in_or_401
from .models import LinkLinkUser


HOMEPAGE_URL = settings.HOMEPAGE_URL
EMAIL_HOST_USER = settings.EMAIL_HOST_USER


def send_register_email(request, recipient, title, message):
    context = {
        "subject": title,
        "message": message,
        "button_link": HOMEPAGE_URL,
    }
    html_mail = render_to_string("linklink/register_email.html", context)
    send_mail(
        subject=title,
        message=message,
        from_email=EMAIL_HOST_USER,
        recipient_list=[recipient],
        html_message=html_mail
    )
    #  return redirect("redirect to a new page")


@allowed_method_or_405(["POST"])
def send_email(request):
    """
    Send email to user depending on mode
    Case1: Register Verify Email
    Case2: Password Reset Email
    """
    try:
        req_data = json.loads(request.body.decode())
        mode = req_data["mode"]
        recipient = req_data["recipient"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    if mode == "register":
        send_register_email(
            request,
            recipient=recipient,
            title="이메일 인증",
            message="회원가입을 하려면 이메일 인증을 진행해주세요"
        )
    elif mode == "password-reset":
        pass
    else:
        expected_mode = ["register", "password-reset"]
        raise ValueError(f"Invalid mode. Expected: {expected_mode},\
            Received: {mode}")
    return HttpResponse(status=201)


@ensure_csrf_cookie
def token(request):
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
    When user enters username, password, nickname and requests signup,
    1. django's User object is created
    2. LinkLinkUser object is created, with emailValidated=False
    3. Send register email to username
    """
    try:
        req_data = json.loads(request.body.decode())
        username = req_data["username"]
        password = req_data["password"]
        nickname = req_data["nickname"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    # Create django"s user
    user = User.objects.create_user(
        username=username,
        password=password
    )
    # Create LinkLinkUser with emailValidated=False
    LinkLinkUser.objects.create(
        user=user,
        nickname=nickname,
        emailValidated=False
    )
    # Send register email to username
    S = requests.Session()
    S.get(os.path.join(HOMEPAGE_URL, "api/token/"))
    token = S.cookies["csrftoken"]
    send_email_dict = {
        "mode": "register",
        "recipient": username
    }
    S.post(
        os.path.join(HOMEPAGE_URL, "api/auth/send_email/"),
        json.dumps(send_email_dict),
        headers={"X-CSRFToken": token}
    )
    return HttpResponse(status=201)


@allowed_method_or_405(["POST"])
def signin(request):
    try:
        req_data = json.loads(request.body.decode())
        username = req_data["username"]
        password = req_data["password"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    user = authenticate(username=username, password=password)
    if user is not None: # login successful
        login(request, user) # log the user in, set django session
        return HttpResponse(status=204)
    else: # login failed: incorrect info
        return HttpResponse(status=401)


@allowed_method_or_405(["GET"])
@logged_in_or_401
def signout(request):
    logout(request) # log the user out, clear django session
    return HttpResponse(status=204)


@allowed_method_or_405(["GET", "POST", "DELETE"])
@logged_in_or_401
def onechon(request):
    if request.method == "GET":
        pass
    elif request.method == "POST":
        pass
    elif request.method == "DELETE":
        pass
    