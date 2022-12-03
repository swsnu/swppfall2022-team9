"""
SkillTag, QualityTag related views module for linklink app
"""

from django.db.models import Q
from django.http import (
    JsonResponse
)

from ..decorators import allowed_method_or_405, logged_in_or_401
from ..models import (
    SkillTag,
    QualityTag,
)

#--------------------------------------------------------------------------
#   SkillTag, QualityTag Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET"])
@logged_in_or_401
def skill_tag_list(request):
    if request.method == "GET": # pragma: no branch
        response_dict = {"skillTags": []}
        all_skill_tags = SkillTag.objects.all()
        response_dict["skillTags"] = [
            skill_tag.name for skill_tag in all_skill_tags
        ]
        return JsonResponse(response_dict) # implicit status code = 200


@allowed_method_or_405(["GET"])
@logged_in_or_401
def quality_tag_list(request):
    if request.method == "GET": # pragma: no branch
        response_dict = {"qualityTags": []}
        all_quality_tags = QualityTag.objects.all()
        response_dict["qualityTags"] = [
            quality_tag.name for quality_tag in all_quality_tags
        ]
        return JsonResponse(response_dict) # implicit status code = 200
