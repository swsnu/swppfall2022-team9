"""
SkillTag, QualityTag related views module for linklink app
"""

import json
from json.decoder import JSONDecodeError

from django.http import (
    HttpResponseBadRequest,
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
from ..tags_list.tags import QUALITY_TAGS

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
            if is_onechon(current_linklinkuser, linklinkuser) and \
                current_linklinkuser.id != linklinkuser.id:
                # Get QualityTagRequest that are active,
                # from current user && to linklinkuser
                active_quality_tag_requests = QualityTagRequest.objects.filter(
                    senderId=current_linklinkuser,
                    getterId=linklinkuser,
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
        if LinkLinkUser.objects.filter(pk=user_id).exists():
            current_linklinkuser = request.user.linklinkuser
            linklinkuser = LinkLinkUser.objects.get(pk=user_id)
            if is_onechon(current_linklinkuser, linklinkuser) and \
                current_linklinkuser.id != linklinkuser.id:
                try:
                    req_data = json.loads(request.body.decode())
                    new_quality_tag_requests = req_data["qualityTags"]
                except (KeyError, JSONDecodeError) as e:
                    return HttpResponseBadRequest(e)
                new_quality_tag_requests = [
                    req["name"] for req in new_quality_tag_requests
                ]
                # Get QualityTagRequest that are active,
                # from current user && to linklinkuser
                old_quality_tag_requests = QualityTagRequest.objects.filter(
                    senderId=current_linklinkuser,
                    getterId=linklinkuser,
                    status=True
                )
                old_quality_tag_requests = [
                    req.name for req in old_quality_tag_requests
                ]
                # QualityTagRequest reset logic
                # New - Old   : must either create or set to true
                # Old - New   : must set to false
                # New AND Old : leave them as true
                new_set = set(new_quality_tag_requests)
                old_set = set(old_quality_tag_requests)
                new_minus_old_set = new_set.difference(old_set)
                old_minus_new_set = old_set.difference(new_set)
                for new_minus_old_quality_tag in new_minus_old_set:
                    if new_minus_old_quality_tag in QUALITY_TAGS:
                        true_quality_tag, _ = \
                            QualityTagRequest.objects.get_or_create(
                                senderId=current_linklinkuser,
                                getterId=linklinkuser,
                                name=new_minus_old_quality_tag
                            )
                        true_quality_tag.status = True
                        true_quality_tag.save()
                    else:
                        return JsonResponse(
                            status=400,
                            data={
                                "message":
                                (
                                    "Request includes invalid qualityTag: "
                                    f"{new_minus_old_quality_tag}"
                                )
                            }
                        )
                for old_minus_new_quality_tag in old_minus_new_set:
                    false_quality_tag = QualityTagRequest.objects.get(
                        senderId=current_linklinkuser,
                        getterId=linklinkuser,
                        status=True,
                        name=old_minus_new_quality_tag
                    )
                    false_quality_tag.status = False
                    false_quality_tag.save()
                return JsonResponse(
                    status=200,
                    data=req_data
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
