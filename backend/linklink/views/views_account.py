"""
Account related views module for linklink app
"""

import json
from json.decoder import JSONDecodeError
from django.contrib.auth import login
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    JsonResponse,
)

from ..decorators import allowed_method_or_405, logged_in_or_401

#--------------------------------------------------------------------------
#   Account Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET"])
@logged_in_or_401
def account_info(request):
    if request.method == "GET": # pragma: no branch
        response_dict = {}
        response_dict["lastname"] = request.user.last_name
        response_dict["firstname"] = request.user.first_name
        response_dict["email"] = request.user.linklinkuser.email_unique
        return JsonResponse(
            status=200,
            data=response_dict
        )


@allowed_method_or_405(["PUT"])
@logged_in_or_401
def password_reset(request):
    if request.method == "PUT": # pragma: no branch
        try:
            req_data = json.loads(request.body.decode())
            new_password = req_data["newPassword"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
        user = request.user
        user.set_password(new_password)
        user.save()
        login(request, user)
        return HttpResponse(status=200)
