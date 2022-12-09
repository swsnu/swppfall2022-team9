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
from django.db import IntegrityError

from ..decorators import allowed_method_or_405, logged_in_or_401

#--------------------------------------------------------------------------
#   Account Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET", "PUT"])
@logged_in_or_401
def account_info(request):
    if request.method == "GET":
        response_dict = {}
        response_dict["lastname"] = request.user.last_name
        response_dict["firstname"] = request.user.first_name
        response_dict["email"] = request.user.linklinkuser.email_unique
        return JsonResponse(
            status=200,
            data=response_dict
        )
    elif request.method == "PUT": # pragma: no branch
        try:
            req_data = json.loads(request.body.decode())
            last_name = req_data["lastname"]
            first_name = req_data["firstname"]
            email = req_data["email"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
        current_user = request.user
        current_linklinkuser = request.user.linklinkuser
        current_user.last_name = last_name
        current_user.first_name = first_name
        current_user.save()
        # For email, differ behavior depending on whether email is new
        old_email = current_linklinkuser.unique_email
        if old_email != email: # pragma: no branch
            current_linklinkuser.email_unique = email
            try:
                current_linklinkuser.save()
            except IntegrityError:
                return JsonResponse(
                    status=400,
                    data={"message": f"email {email} already exists in DB"}
                )
            # set emailValidated to False if new email is set
            current_linklinkuser.emailValidated = False
            current_linklinkuser.save()
        return JsonResponse(
            status=200,
            data=req_data
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
