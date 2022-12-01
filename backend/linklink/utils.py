"""
views module for linklink app
"""

from datetime import datetime
import os

from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils import timezone

from .models import (
    FriendRequest,
)

#--------------------------------------------------------------------------
#   Setting constants
#--------------------------------------------------------------------------

HOMEPAGE_URL = settings.HOMEPAGE_URL
EMAIL_HOST_USER = settings.EMAIL_HOST_USER
EMAIL_EXPIRE_DAYS = settings.EMAIL_EXPIRE_DAYS

#--------------------------------------------------------------------------
#   Helper Functions
#--------------------------------------------------------------------------

def send_register_email(
    recipient,
    token,
    title="이메일 인증",
    message="회원가입을 하려면 이메일 인증을 진행해주세요"):
    """
    Helper function to send register email to recipient

    Args:
    recipient: str, email address
    title: str, title
    message: str, message
    token: str, register verification token
    Return:
    None
    """
    context = {
        "subject": title,
        "message": message,
        "button_link": os.path.join(HOMEPAGE_URL, "verify", token) + "/",
    }
    html_mail = render_to_string("linklink/register_email.html", context)
    send_mail(
        subject=title,
        message=message,
        from_email=EMAIL_HOST_USER,
        recipient_list=[recipient],
        html_message=html_mail
    )


def is_expired(query_time):
    """
    Helper function to determine whether query_time is expired

    Args:
    query_time: datetime, time to check expiration
    Returns:
    boolean
    """
    kst_tz = timezone.get_default_timezone()
    # Align timezone to KST(Korea Standard Time) for fair comparison
    token_expire_time= query_time.astimezone(kst_tz)
    time_now = datetime.now().astimezone(kst_tz)
    return time_now > token_expire_time


def get_onechon_linklinkuser_list(
    queryset,
    linklinkuser,
    exclude_linklinkuser=None):
    """
    Helper function to get all onechon of given linklinkuser

    Args:
    queryset: queryset of FriendRequest
    linklinkuser: LinkLinkUser for search
    exclude_linklinkuser: LinkLinkUser to exclude from final result
    Return:
    List[LinkLinkUser]
    """
    accepted_friend_requests = queryset.filter(
        Q(senderId=linklinkuser) | Q(getterId=linklinkuser)
    )
    onechon_list = []
    for accepted_friend_request in accepted_friend_requests:
        onechon_list.append(accepted_friend_request.senderId)
        onechon_list.append(accepted_friend_request.getterId)
    # remove duplicates
    onechon_list = set(onechon_list)
    if onechon_list: # pragma: no branch
        onechon_list.remove(linklinkuser)
    # exclude exclude_linklinkuser
    if exclude_linklinkuser is not None:
        onechon_list.remove(exclude_linklinkuser)
    return list(onechon_list)


def profile_package_response_body(profile_found, is_me):
    """
    Helper function to package the response body for profile APIs

    Args:
    profile_found: Profile
    is_me: indicates whether profile belongs to request.user.linklinkuser
    Return:
    Dict
    """
    response_dict = {}
    # Construct Profile
    response_dict["introduction"] = profile_found.introduction
    response_dict["skillTags"] = []
    for skill_tag in profile_found.skillTags.all():
        response_dict["skillTags"].append(
            {"name": skill_tag.name}
        )
    if is_me:
        response_dict["qualityTags"] = None # set as null
    else:
        response_dict["qualityTags"] = []
        for quality_tag in profile_found.qualityTags.all():
            response_dict["qualityTags"].append(
                {"name": quality_tag.name}
            )
    response_dict["educations"] = []
    for education in profile_found.education_set.all():
        education_dict = {}
        education_dict["school"] = education.school
        education_dict["major"] = education.major
        education_dict["dateStart"] = education.dateStart
        education_dict["dateEnd"] = education.dateEnd
        response_dict["educations"].append(education_dict)
    response_dict["jobExperiences"] = []
    for job_experience in profile_found.jobexperience_set.all():
        job_experience_dict = {}
        job_experience_dict["company"] = job_experience.company
        job_experience_dict["position"] = job_experience.position
        job_experience_dict["dateStart"] = job_experience.dateStart
        job_experience_dict["dateEnd"] = job_experience.dateEnd
        response_dict["jobExperiences"].append(job_experience_dict)
    response_dict["website"] = profile_found.website
    response_dict["imgUrl"] = profile_found.imgUrl
    return response_dict


def is_within_twochon(linklinkuser1, linklinkuser2):
    """
    Helper function to determine whether two users are within twochon.
    """
    # Get all Accepted FriendRequest
    all_accepted_friend_requests = FriendRequest.objects.filter(
        status="Accepted"
    )
    # Get onechon of linklinkuser1
    onechon_list = get_onechon_linklinkuser_list(
        all_accepted_friend_requests,
        linklinkuser1
    )
    within_twochon_list = onechon_list.copy()
    for onechon_linklinkuser in onechon_list:
        twochon_list = get_onechon_linklinkuser_list(
            all_accepted_friend_requests,
            onechon_linklinkuser,
            exclude_linklinkuser=linklinkuser1
        )
        within_twochon_list.extend(twochon_list)
    return linklinkuser2 in within_twochon_list
