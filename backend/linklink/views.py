"""
views module for linklink app
"""

from datetime import datetime, timedelta
import json
from json.decoder import JSONDecodeError
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.db.models import Q
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    JsonResponse
)
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie

from .decorators import allowed_method_or_405, logged_in_or_401
from .models import (
    LinkLinkUser,
    FriendRequest,
    Verification,
    SkillTag,
    Profile,
    Education,
    JobExperience,
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

#--------------------------------------------------------------------------
#   Auth Related APIs
#--------------------------------------------------------------------------

@ensure_csrf_cookie
def csrf_token(request):
    """
    Returns csrf token
    """
    if request.method == "GET":
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["GET"])


@allowed_method_or_405(["POST"])
def signup(request):
    """
    When user enters required info and requests signup,
    1. Create django User object
    2. Create LinkLinkUser object with emailValidated=False
    3. Create Verification object
    4. Create Profile object
    5. Send register email to linklinkuser.email_unique
    """
    try:
        req_data = json.loads(request.body.decode())
        username = req_data["username"]
        password = req_data["password"]
        email = req_data["email"]
        firstname = req_data["firstname"]
        lastname = req_data["lastname"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    # Create django User object
    user = User.objects.create_user(
        username=username,
        password=password,
        #email=email, email will be added not in User, but LinkLinkUser
        first_name=firstname,
        last_name=lastname
    )
    # Create LinkLinkUser object with emailValidated=False
    linklinkuser = LinkLinkUser.objects.create(
        user=user,
        emailValidated=False,
        email_unique = email
    )
    # Create Verification object
    expire_time = datetime.now() + timedelta(days=EMAIL_EXPIRE_DAYS)
    kst_tz = timezone.get_default_timezone()
    expire_time= expire_time.astimezone(kst_tz)
    verification = Verification.objects.create(
        linklinkuser=linklinkuser,
        purpose="Register",
        expiresAt=expire_time
    )
    # Create Profile object
    Profile.objects.create(
        linklinkuser=linklinkuser,
        introduction=f"안녕하세요, {linklinkuser}입니다."
    )
    # Send register email to linklinkuser.email_unique
    send_register_email(
        recipient=linklinkuser.email_unique,
        token=str(verification.token)
    )
    return HttpResponse(status=201)


@allowed_method_or_405(["POST"])
def signin(request):
    """
    When user enters username and password,
    1. Validate whether username + password exists
    2-1. If emailValidated, login
    2-2. Else, find token and resend register email
    """
    try:
        req_data = json.loads(request.body.decode())
        username = req_data["username"]
        password = req_data["password"]
    except (KeyError, JSONDecodeError) as e:
        return HttpResponseBadRequest(e) # implicit status code = 400
    # Validate whether username + password exists
    user = authenticate(username=username, password=password)
    if user is not None:
        # If emailValidated, login
        if user.linklinkuser.emailValidated:
            login(request, user)
            response_dict = {
                "id": user.linklinkuser.id,
                "email": user.linklinkuser.email_unique,
                "username": user.username,
                "firstname": user.first_name,
                "lastname": user.last_name,
            }
            return JsonResponse(
                status=200,
                data=response_dict
            )
        # Else, find token and resend register email
        else:
            # Find Verification object
            verification_found = Verification.objects.get(
                linklinkuser=user.linklinkuser
            )
            if is_expired(verification_found.expiresAt):
                # Update expiration if it has expired
                kst_tz = timezone.get_default_timezone()
                new_expire_time = \
                    datetime.now() + timedelta(days=EMAIL_EXPIRE_DAYS)
                new_expire_time = new_expire_time.astimezone(kst_tz)
                verification_found.expiresAt = new_expire_time
                verification_found.save()
            # Resend register email
            send_register_email(
                user.linklinkuser.email_unique,
                str(verification_found.token)
            )
            resent_email_message = (
                f"Account {username} exists, but is not validated. "
                "A validation email has been resent to "
                f"{user.linklinkuser.email_unique}."
            )
            return JsonResponse(
                status=401,
                data={"message": resent_email_message}
            )
    else: # login failed: incorrect info
        return JsonResponse(
            status=401,
            data={"message": "incorrect username or password."}
        )


@allowed_method_or_405(["GET"])
@logged_in_or_401
def signout(request):
    logout(request) # log the user out, clear django session
    return HttpResponse(status=204)


@allowed_method_or_405(["GET"])
# pylint: disable=unused-argument
def verify(request, token):
    """
    When user clicks link from email,
    1. Find Verification object with token=token
    2-1. If Register: check token expire, set user's emailValidated as True
    2-2. Elif Password: TODO
    """
    # Find Verification object with token=token
    verification_found = get_object_or_404(Verification, token=token)
    # Register: check token expire, set user's emailValidated as True
    if verification_found.purpose == "Register": # pragma: no branch
        if is_expired(verification_found.expiresAt):
            return JsonResponse(
                status=401, # Unauthorized
                data={"message":"Token Expired"}
            )
        else:
            verification_found.linklinkuser.emailValidated = True
            verification_found.linklinkuser.save()
    # elif verification_found.purpose == "Password":
    #     pass
    return JsonResponse({"message":"Successfully verified"})

#--------------------------------------------------------------------------
#   LinkLinkUser Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET", "POST", "DELETE"])
@logged_in_or_401
def friend(request):
    if request.method == "GET": # pragma: no branch
        # Get all Accepted FriendRequest
        all_accepted_friend_requests = FriendRequest.objects.filter(
            status="Accepted"
        )
        # Get onechon of current user
        onechon_list = get_onechon_linklinkuser_list(
            all_accepted_friend_requests,
            request.user.linklinkuser
        )
        response_dict = {"friendList": []} # Nested dict
        for onechon_linklinkuser in onechon_list:
            # Construct onechon_dict
            onechon_dict = {}
            onechon_dict["id"] = onechon_linklinkuser.id
            onechon_dict["firstname"] = onechon_linklinkuser.user.first_name
            onechon_dict["lastname"] = onechon_linklinkuser.user.last_name
            onechon_dict["imgUrl"] = onechon_linklinkuser.profile.imgUrl
            onechon_dict["isTwoChon"] = False
            onechon_dict["chons"] = []
            twochon_list = get_onechon_linklinkuser_list(
                all_accepted_friend_requests,
                onechon_linklinkuser,
                exclude_linklinkuser=request.user.linklinkuser
            )
            for twochon_linklinkuser in twochon_list:
                # Construct twochon_dict
                twochon_dict = {}
                twochon_dict["id"] = twochon_linklinkuser.id
                twochon_dict["firstname"] = \
                    twochon_linklinkuser.user.first_name
                twochon_dict["lastname"] = \
                    twochon_linklinkuser.user.last_name
                twochon_dict["imgUrl"] = twochon_linklinkuser.profile.imgUrl
                twochon_dict["isTwoChon"] = True
                # Append constructed twochon_dict
                onechon_dict["chons"].append(twochon_dict)
            # Append constructed onechon_dict
            response_dict["friendList"].append(onechon_dict)
        return JsonResponse(response_dict) # implicit status code = 200
    # elif request.method == "POST":
    #     pass
    # elif request.method == "DELETE":
    #     pass

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

#--------------------------------------------------------------------------
#   FriendRequest Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET", "POST"])
@logged_in_or_401
def friend_request(request):
    if request.method == "GET":
        # Check whether query params are requested
        user1_id = request.GET.get("user1Id", None)
        user2_id = request.GET.get("user2Id", None)
        linklinkuser = request.user.linklinkuser
        if user1_id is None and user2_id is None:
            # Return all my pending FriendRequests
            pending_friend_requests = FriendRequest.objects.filter(
                status="Pending"
            ).filter(
                Q(senderId=linklinkuser) | Q(getterId=linklinkuser)
            )
            # Construct response
            response_dict = {"friendRequests": []}
            for pending_friend_request in pending_friend_requests:
                friend_request_dict = {}
                friend_request_dict["id"] = pending_friend_request.id
                friend_request_dict["senderId"] = \
                    pending_friend_request.senderId.id
                friend_request_dict["getterId"] = \
                    pending_friend_request.getterId.id
                friend_request_dict["status"] = pending_friend_request.status
                response_dict["friendRequests"].append(friend_request_dict)
            return JsonResponse(status=200, data=response_dict)
        elif user1_id is not None and user2_id is not None:
            # If read permission,
            # Find FriendRequest such that user1_id AND user2_id
            # Check read permission
            if linklinkuser.id not in map(int, (user1_id, user2_id)):
                no_read_permission_message = (
                    "No read permission for FriendRequest "
                    f"user1Id={user1_id}, user2Id={user2_id}."
                )
                return JsonResponse(
                    status=403,
                    data={"message": no_read_permission_message}
                )
            try:
                friend_request_found = FriendRequest.objects.get(
                    (Q(senderId=user1_id) & Q(getterId=user2_id))
                    |
                    (Q(senderId=user2_id) & Q(getterId=user1_id))
                )
            except FriendRequest.DoesNotExist:
                friend_request_not_found_message = (
                    f"FriendRequest user1Id={user1_id}, "
                    f"user2Id={user2_id} not found."
                )
                return JsonResponse(
                    status=404,
                    data={"message": friend_request_not_found_message}
                )
            return JsonResponse(
                status=200,
                data={
                    "id": friend_request_found.id,
                    "senderId": friend_request_found.senderId.id,
                    "getterId": friend_request_found.getterId.id,
                    "status": friend_request_found.status,
                }
            )
        else:
            return JsonResponse(
                status=405,
                data={"message":"invalid query param"}
            )
    elif request.method == "POST":
        # If there is no FriendRequest, Create FriendRequest to getterId
        try:
            req_data = json.loads(request.body.decode())
            getter_id = req_data["getterId"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
        linklinkuser_sender = request.user.linklinkuser
        linklinkuser_getter = LinkLinkUser.objects.get(id=getter_id)
        # Check whether FriendRequest exist between two users
        friend_request_found = FriendRequest.objects.filter(
            (Q(senderId=linklinkuser_sender) & Q(getterId=linklinkuser_getter))
            |
            (Q(senderId=linklinkuser_getter) & Q(getterId=linklinkuser_sender))
        )
        if friend_request_found:
            friend_request_already_exist_message = (
                "FriendRequest already exists between "
                f"user1Id={linklinkuser_sender}, user2Id={linklinkuser_getter}."
            )
            return JsonResponse(
                status=403,
                data={"message":friend_request_already_exist_message}
            )
        else:
            # Check whether two users are within twochon
            other_user = LinkLinkUser.objects.get(id=getter_id)
            if not is_within_twochon(linklinkuser, other_user):
                not_within_twochon_message = \
                    "Two users are not within twochon."
                return JsonResponse(
                    status=403,
                    data={"message": not_within_twochon_message},
                )
            # Create FriendRequest to getterId
            FriendRequest.objects.create(
                senderId=linklinkuser_sender,
                getterId=linklinkuser_getter,
                status="Pending",
            )
            return HttpResponse(status=201)


@allowed_method_or_405(["PUT"])
@logged_in_or_401
def friend_request_respond(request, friend_request_id):
    if request.method == "PUT":
        # 1. Get FriendRequest=friendRequestId
        # 2. Check write permission of current user
        # 3. Change status of FriendRequest
        try:
            req_data = json.loads(request.body.decode())
            new_status = req_data["status"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest(e) # implicit status code = 400
        # Get FriendRequest=friendRequestId
        try:
            friend_request_found = \
                FriendRequest.objects.get(id=friend_request_id)
        except FriendRequest.DoesNotExist:
            friend_request_not_found_message = \
                f"FriendRequest id={friend_request_id} not found."
            return JsonResponse(
                status=404,
                data={"message": friend_request_not_found_message}
            )
        # Check write permission  and state transition
        # State Transition Table
        #--------------------------------------------------|
        # Before\After | Accepted  | Pending   | Rejected  |
        # Accepted     | No change | Illegal   | Both      |
        # Pending      | Getter    | No change | Getter    |
        # Rejected     | Illegal   | Both*     | No change |
        #--------------------------------------------------|
        # No change: No state change, do nothing
        # Illegal: State Change not allowed
        # Getter: Only Getter has write permission
        # Both: Both Sender and Getter have write permission
        # Both*: Both Sender and Getter have write permission,
        #   with some additional conditions
        #   New request should reset sender and getter accordingly
        #   New request can be made only if the two LinkLinkUsers
        #       are within twochon relationship
        state_transition_dict = {
            "Accepted": {
                "Accepted": "No change",
                "Pending": "Illegal",
                "Rejected": "Both",
            },
            "Pending": {
                "Accepted": "Getter",
                "Pending": "No change",
                "Rejected": "Getter",
            },
            "Rejected": {
                "Accepted": "Illegal",
                "Pending": "Both",
                "Rejected": "No change",
            },
        }
        linklinkuser = request.user.linklinkuser
        prev_status = friend_request_found.status
        state_transition_result = state_transition_dict[prev_status][new_status]
        if state_transition_result == "Illegal":
            illegal_state_transition_message = (
                "State Transition: "
                f"{prev_status}->{new_status} not allowed."
            )
            return JsonResponse(
                status=403,
                data={"message": illegal_state_transition_message},
            )
        elif state_transition_result == "No Change":
            return JsonResponse(
                status=200,
                data={
                "id": friend_request_found.id,
                "senderId": friend_request_found.senderId.id,
                "getterId": friend_request_found.getterId.id,
                "status": friend_request_found.status,
                }
            )
        elif state_transition_result == "Getter":
            if friend_request_found.getterId.id != linklinkuser.id:
                no_write_permission_message = (
                    "Current user has no write permission for "
                    f"FriendRequest id={friend_request_id}."
                )
                return JsonResponse(
                    status=403,
                    data={"message": no_write_permission_message}
                )
        elif state_transition_result == "Both":
            sender_or_getter = (
                friend_request_found.senderId.id,
                friend_request_found.getterId.id
            )
            if linklinkuser.id not in sender_or_getter:
                no_write_permission_message = (
                    "Current user has no write permission for "
                    f"FriendRequest id={friend_request_id}."
                )
                return JsonResponse(
                    status=403,
                    data={"message": no_write_permission_message}
                )
            else:
                if prev_status == "Rejected": # Both* Case
                    sender_getter = [
                        friend_request_found.senderId,
                        friend_request_found.getterId
                    ]
                    sender_getter.remove(linklinkuser)
                    other_user = sender_getter[0]
                    # Check whether two users are within twochon
                    if not is_within_twochon(linklinkuser, other_user):
                        not_within_twochon_message = \
                            "Two users are not within twochon."
                        return JsonResponse(
                            status=403,
                            data={"message": not_within_twochon_message},
                        )
                    # set new sender getter
                    friend_request_found.senderId = linklinkuser
                    friend_request_found.getterId = other_user
        # Change status of FriendRequest
        friend_request_found.status = new_status
        friend_request_found.save()
        return JsonResponse(
            status=200,
            data={
                "id": friend_request_found.id,
                "senderId": friend_request_found.senderId.id,
                "getterId": friend_request_found.getterId.id,
                "status": friend_request_found.status,
            }
        )
