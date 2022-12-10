"""
Forgot related views module for linklink app
"""

import json
from json.decoder import JSONDecodeError

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
from ..tags_list.tags import QUALITY_TAGS

#--------------------------------------------------------------------------
#   Forgot Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET"])
def forgot_username(request):
    if request.method == "GET": # pragma: no branch
        pass


@allowed_method_or_405(["POST, PUT"])
def forgot_password(request):
    if request.method == "POST":
        pass
    elif request.method == "PUT": # pragma: no branch
        pass

