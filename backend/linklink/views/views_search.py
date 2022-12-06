"""
Search related views module for linklink app
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
    Profile,
    SkillTag,
    JobExperience,
    Education,
    FriendRequest
)
from ..utils import get_onechon_linklinkuser_list, get_filtered_linklinkuser_list

# --------------------------------------------------------------------------
#   Search Related APIs
# --------------------------------------------------------------------------


@allowed_method_or_405(["GET"])
@logged_in_or_401
def search_friends(request, search_keys):
    if request.method == "GET": # pragma: no branch
        # Get Search keys
        search_keys = [search_key.strip().lower()
                       for search_key in search_keys.split(",")]

        # Get all Accepted FriendRequest
        all_accepted_friend_requests = FriendRequest.objects.filter(
            status="Accepted"
        )

        # Get onechon, twochon of current user
        onechon_list = get_onechon_linklinkuser_list(
            all_accepted_friend_requests,
            request.user.linklinkuser
        )

        # filter one chons
        filtered_onechon_list = get_filtered_linklinkuser_list(
            onechon_list,
            search_keys
        )

        response_dict = {"friendList": []}  # Nested dict
        for onechon_linklinkuser in onechon_list:
            

            # construct onechon_dict
            onechon_dict = {}
            onechon_dict["id"] = onechon_linklinkuser.id
            onechon_dict["firstname"] = onechon_linklinkuser.user.first_name
            onechon_dict["lastname"] = onechon_linklinkuser.user.last_name
            onechon_dict["imgUrl"] = onechon_linklinkuser.profile.imgUrl
            onechon_dict["isTwoChon"] = False
            onechon_dict["chons"] = []
            onechon_dict["isSearched"] = False
            if onechon_linklinkuser in filtered_onechon_list:
                onechon_dict["isSearched"] = True

            twochon_list = get_onechon_linklinkuser_list(
                all_accepted_friend_requests,
                onechon_linklinkuser,
                exclude_linklinkuser=request.user.linklinkuser
            )
            # filter twochon_list
            filtered_twochon_list = get_filtered_linklinkuser_list(
                twochon_list,
                search_keys
            )

            for twochon_linklinkuser in filtered_twochon_list:
                # construct twochon_dict
                twochon_dict = {}
                twochon_dict["id"] = twochon_linklinkuser.id
                twochon_dict["firstname"] = \
                    twochon_linklinkuser.user.first_name
                twochon_dict["lastname"] = \
                    twochon_linklinkuser.user.last_name
                twochon_dict["imgUrl"] = twochon_linklinkuser.profile.imgUrl
                twochon_dict["isTwoChon"] = True
                twochon_dict["chons"] = []
                # Append constructed twochon_dict
                onechon_dict["chons"].append(twochon_dict)
            response_dict["friendList"].append(onechon_dict)

        return JsonResponse(response_dict)  # implicit status code = 200
