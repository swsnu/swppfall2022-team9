"""
profile related views module for linklink app
"""

import json
from json.decoder import JSONDecodeError

import cloudinary.uploader
from django.http import (
    HttpResponseBadRequest,
    JsonResponse
)

from ..decorators import allowed_method_or_405, logged_in_or_401
from ..models import (
    LinkLinkUser,
    FriendRequest,
    Profile,
    SkillTag,
    JobExperience,
    Education,
)
from ..views import get_onechon_linklinkuser_list, profile_package_response_body

#--------------------------------------------------------------------------
#   Profile Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["PUT"])
@logged_in_or_401
def my_profile(request):
    if request.method == "PUT": # pragma: no branch
        # When user enters profile info and puts,
        # 1. Find Profile object
        # 2. Construct new profile object and save
        # Find Profile object
        profile_found = \
            Profile.objects.get(linklinkuser=request.user.linklinkuser)
        try:
            req_data = json.loads(request.body.decode())
            introduction = req_data["introduction"]
            skill_tags = req_data["skillTags"]
            educations = req_data["educations"]
            job_experiences = req_data["jobExperiences"]
            website = req_data["website"]
            img_url = req_data["imgUrl"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
        # Update simple fields
        profile_found.introduction = introduction
        profile_found.website = website
        profile_found.imgUrl = img_url
        # Update skillTags
        profile_found.skillTags.clear()
        for skill_tag in skill_tags:
            try:
                skill_tag_instance = \
                    SkillTag.objects.get(name=skill_tag["name"])
                profile_found.skillTags.add(skill_tag_instance)
            except SkillTag.DoesNotExist:
                return JsonResponse(
                    status=404,
                    data={
                        "message":
                        f"SkillTag {skill_tag['name']} not found."
                    }
                )
        # Update Education objects
        profile_found.education_set.all().delete()
        for education in educations:
            Education.objects.create(
                profile=profile_found,
                school=education["school"],
                major=education["major"],
                dateStart=education["dateStart"],
                dateEnd=education["dateEnd"],
            )
        # Update JobExperience objects
        profile_found.jobexperience_set.all().delete()
        for job_experience in job_experiences:
            JobExperience.objects.create(
                profile=profile_found,
                company=job_experience["company"],
                position=job_experience["position"],
                dateStart=job_experience["dateStart"],
                dateEnd=job_experience["dateEnd"],
            )
        # Save updated profile
        profile_found.save()
        return JsonResponse(
            status=200,
            data=req_data,
        )


@allowed_method_or_405(["GET"])
@logged_in_or_401
def profile(request, user_id):
    if request.method == "GET": # pragma: no branch
        if LinkLinkUser.objects.filter(pk=user_id).exists():
            linklinkuser = LinkLinkUser.objects.get(pk=user_id)
            # Get all Accepted FriendRequest
            all_accepted_friend_requests = FriendRequest.objects.filter(
                status="Accepted"
            )
            # Get onechon, twochon of current user
            onechon_list = get_onechon_linklinkuser_list(
                all_accepted_friend_requests,
                request.user.linklinkuser
            )
            twochon_list = []
            for onechon_linklinkuser in onechon_list:
                twochon_list.extend(get_onechon_linklinkuser_list(
                    all_accepted_friend_requests,
                    onechon_linklinkuser,
                    exclude_linklinkuser=request.user.linklinkuser
                ))
            # remove duplicates and extend onechon & twochon
            profile_read_permission = list(set(onechon_list + twochon_list))
            # Add myself as profile_read_permission
            profile_read_permission.append(request.user.linklinkuser)
            if linklinkuser in profile_read_permission:
                profile_found = \
                    Profile.objects.get(linklinkuser=linklinkuser)
                response_dict = profile_package_response_body(
                    profile_found=profile_found,
                    is_me=linklinkuser.id==request.user.linklinkuser.id)
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


@allowed_method_or_405(["POST"])
@logged_in_or_401
def upload_image(request):
    if request.method == "POST": # pragma: no branch
        try:
            upload_result = \
                cloudinary.uploader.upload(request.FILES["profileImage"])
        except KeyError as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
        response_dict = {
            "imgUrl" : upload_result["secure_url"]
        }
        return JsonResponse(
            status=200,
            data=response_dict,
        )