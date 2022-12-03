"""
Chat related views module for linklink app
"""

import json
from json.decoder import JSONDecodeError

from django.http import HttpResponseBadRequest, JsonResponse

from ..decorators import allowed_method_or_405, logged_in_or_401
from ..models import LinkLinkUser, ChatRoom

# --------------------------------------------------------------------------
#   Chat Related APIs
# --------------------------------------------------------------------------


@allowed_method_or_405(["GET"])
@logged_in_or_401
def chat_list(request):
    if request.method == "GET":
        linklinkuser = request.user.linklinkuser
        chat_room_list = ChatRoom.objects.filter(name__contains=f"[{linklinkuser.id}]")
        response_dict = {"chatRoomInfoList": []}
        for chat_room in chat_room_list:
            # Send chat rooms that contain at least one message
            if len(chat_room.messages.all()) > 0:
                chat_room_dict = {}
                chat_room_dict["chatRoomName"] = chat_room.name.replace(
                    "[", ""
                ).replace("]", "")
                userId1, userId2 = map(
                    int, chat_room.name.replace("[", "").replace("]", "").split("__")
                )

                otherUserId = userId2 if linklinkuser.id == userId1 else userId1
                otherUser = LinkLinkUser.objects.get(id=otherUserId)
                chat_room_dict["otherUserName"] = (
                    otherUser.user.last_name + otherUser.user.first_name
                )
                chat_room_dict["otherUserImgUrl"] = otherUser.profile.imgUrl
                lastMessage = chat_room.messages.all().order_by("-timeStamp")[0]
                chat_room_dict["lastMessage"] = lastMessage.content
                chat_room_dict["lastTimeStamp"] = lastMessage.timeStamp

                response_dict["chatRoomInfoList"].append(chat_room_dict)
        return JsonResponse(status=200, data=response_dict)


@allowed_method_or_405(["GET"])
@logged_in_or_401
def chat(request, chat_room_name):
    if request.method == "GET":
        linklinkuser = request.user.linklinkuser
        userId1, userId2 = map(int, chat_room_name.split("__"))
        chat_room = ChatRoom.objects.get(name=f"[{userId1}]__[{userId2}]")

        response_dict = {}
        response_dict["chatRoomName"] = chat_room_name
        otherUserId = userId2 if linklinkuser.id == userId1 else userId1
        otherUser = LinkLinkUser.objects.get(id=otherUserId)
        response_dict["otherUserName"] = (
            otherUser.user.last_name + otherUser.user.first_name
        )
        response_dict["otherUserImgUrl"] = otherUser.profile.imgUrl
        lastMessage = chat_room.messages.all().order_by("-timeStamp")[0]
        response_dict["lastMessage"] = lastMessage.content
        response_dict["lastTimeStamp"] = lastMessage.timeStamp
        return JsonResponse(status=200, data=response_dict)
