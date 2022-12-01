"""
FriendRequest related views module for linklink app
"""

import json
from json.decoder import JSONDecodeError

from django.db.models import Q
from django.http import (
    HttpResponseBadRequest,
    JsonResponse
)

from ..decorators import allowed_method_or_405, logged_in_or_401
from ..invariants import max_onechon_invariant
from ..models import (
    LinkLinkUser,
    FriendRequest,
)
from ..views import is_within_twochon

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
                friend_request_dict["senderImgUrl"] = \
                    pending_friend_request.senderId.profile.imgUrl
                friend_request_dict["senderName"] = \
                    str(pending_friend_request.senderId)
                response_dict["friendRequests"].append(friend_request_dict)
            return JsonResponse(status=200, data=response_dict)
        elif user1_id is not None and user2_id is not None:
            # If read permission,
            # Find FriendRequest such that user1_id AND user2_id
            # Check read permission
            if linklinkuser.id not in \
                map(int, (user1_id, user2_id)): # pragma: no branch
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
                    "senderImgUrl": \
                        friend_request_found.senderId.profile.imgUrl,
                    "senderName": str(friend_request_found.senderId),
                }
            )
        else:
            return JsonResponse(
                status=405,
                data={"message":"invalid query param"}
            )
    elif request.method == "POST": # pragma: no branch
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
            if not is_within_twochon(linklinkuser_sender, other_user):
                not_within_twochon_message = \
                    "Two users are not within twochon."
                return JsonResponse(
                    status=403,
                    data={"message": not_within_twochon_message},
                )
            # Create FriendRequest to getterId
            friend_request_created = FriendRequest.objects.create(
                senderId=linklinkuser_sender,
                getterId=linklinkuser_getter,
                status="Pending",
            )
            return JsonResponse(
                status=201,
                data={
                    "id": friend_request_created.id,
                    "senderId": friend_request_created.senderId.id,
                    "getterId": friend_request_created.getterId.id,
                    "status": friend_request_created.status,
                }
            )


@allowed_method_or_405(["PUT"])
@logged_in_or_401
def friend_request_respond(request, friend_request_id):
    if request.method == "PUT":  # pragma: no branch
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
        elif state_transition_result == "No change":
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
        # Check Max Onechon Invariant
        if new_status == "Accepted":
            max_onechon_invariant(friend_request_found.senderId)
            max_onechon_invariant(friend_request_found.getterId)
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
