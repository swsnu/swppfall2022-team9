"""
SkillTag, QualityTag related views module for linklink app
"""

from django.http import (
    JsonResponse
)

from ..decorators import allowed_method_or_405, logged_in_or_401
from ..models import (
    LinkLinkUser,
    SkillTag,
    QualityTag,
    QualityTagRequest,
)
from ..utils import is_onechon

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


@allowed_method_or_405(["GET", "PUT"])
@logged_in_or_401
def quality_tag(request, user_id):
    if request.method == "GET":
        if LinkLinkUser.objects.filter(pk=user_id).exists():
            current_linklinkuser = request.user.linklinkuser
            linklinkuser = LinkLinkUser.objects.get(pk=user_id)
            if is_onechon(current_linklinkuser, linklinkuser):
                # Get QualityTagRequest that are active,
                # from current user && to linklinkuser
                active_quality_tag_requests = QualityTagRequest.objects.filter(
                    senderId=current_linklinkuser
                ).filter(
                    getterId=linklinkuser
                ).filter(
                    status=True
                )
                response_dict = {"qualityTags": []}
                response_dict["qualityTags"] = [
                    {"name": req.name} for req in active_quality_tag_requests
                ]
                return JsonResponse(
                    status=200,
                    data=response_dict
                )
            else:
                return JsonResponse(
                    status=403,
                    data={
                        "message":
                        f"No read permission for userId={user_id}."
                    }
                )
        else:
            return JsonResponse(
                status=404,
                data={
                    "message":
                    f"userId={user_id} not found."
                }
            )

    elif request.method == "PUT": # pragma: no branch
        pass
