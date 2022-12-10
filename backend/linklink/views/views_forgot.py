"""
Forgot related views module for linklink app
"""

import json
from json.decoder import JSONDecodeError

from django.contrib.auth.models import User
from django.http import (
    HttpResponseBadRequest,
    JsonResponse
)

from ..decorators import allowed_method_or_405
from ..models import (
    LinkLinkUser,
    SkillTag,
    QualityTag,
    QualityTagRequest,
)
from ..utils import is_onechon

#--------------------------------------------------------------------------
#   Forgot Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET"])
def forgot_username(request):
    if request.method == "GET": # pragma: no branch
        try:
            req_data = json.loads(request.body.decode())
            email = req_data["email"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
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


@allowed_method_or_405(["POST, PUT"])
def forgot_password(request):
    if request.method == "POST":
        pass
    elif request.method == "PUT": # pragma: no branch
        pass

