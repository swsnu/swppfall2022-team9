"""
Linklinkuser related views module for linklink app
"""

from django.http import (
    JsonResponse,
)

from ..decorators import allowed_method_or_405, logged_in_or_401
from ..models import (
    FriendRequest,
)
from ..views import get_onechon_linklinkuser_list

#--------------------------------------------------------------------------
#   LinkLinkUser Related APIs
#--------------------------------------------------------------------------

@allowed_method_or_405(["GET"])
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


@allowed_method_or_405(["GET"])
@logged_in_or_401
def friend_request_token(request):
    if request.method == "GET": # pragma: no branch
        response_dict = {}
        linklinkuser = request.user.linklinkuser
        response_dict["friendRequestToken"] = linklinkuser.friendRequestToken
        return JsonResponse(response_dict) # implicit status code = 200
