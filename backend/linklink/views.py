"""
views module for linklink app
"""

import json
from json.decoder import JSONDecodeError

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

from .decorators import allowed_method_or_405, logged_in_or_401
from .models import LinkLinkUser


def send_register_email(request, recipient, title, message):
    subject = title
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [recipient]
    context = {
        "subject": subject,
        "message": message,
        "button_link": "https://www.google.com",
    }
    html_mail = render_to_string("linklink/register_email.html", context)
    send_mail(
            subject, message, email_from, recipient_list, html_message=html_mail
    )
    # send_mail(subject, message, email_from, recipient_list)
    #  return redirect('redirect to a new page')
    return True


def email_test(request):
    if request.method == "GET":
        send_register_email(request, 'hunkim98@gmail.com', '이메일 인증' ,'회원가입을 하려면 이메일 인증을 진행해주세요')
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(["POST"])


@ensure_csrf_cookie
def token(request):
    """
    Returns csrf token
    """
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])


@allowed_method_or_405(['POST'])
def signup(request):
    """
    When user enters username, password, nickname and requests signup,
    1. django's User object is created
    2. LinkLinkUser object is created, with emailValidated=False
    """
    try:
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        nickname = req_data['nickname']
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest() # implicit status code = 400
    # Create django's user
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
    return HttpResponse(status=201)


@allowed_method_or_405(['POST'])
def signin(request):
    try:
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest() # implicit status code = 400
    user = authenticate(username=username, password=password)
    if user is not None: # login successful
        login(request, user) # log the user in, set django session
        return HttpResponse(status=204)
    else: # login failed: incorrect info
        return HttpResponse(status=401)


@allowed_method_or_405(['GET'])
@logged_in_or_401
def signout(request):
    logout(request) # log the user out, clear django session
    return HttpResponse(status=204)


@allowed_method_or_405(['GET', 'POST', 'DELETE'])
@logged_in_or_401
def onechon(request):
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        pass
    elif request.method == 'DELETE':
        pass
    