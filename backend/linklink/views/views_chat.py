"""
Chat related views module for linklink app
"""

from django.http import JsonResponse

from ..decorators import allowed_method_or_405, logged_in_or_401
from ..models import LinkLinkUser, ChatRoom

# --------------------------------------------------------------------------
#   Chat Related APIs
# --------------------------------------------------------------------------


@allowed_method_or_405(["GET"])
@logged_in_or_401
def chat_list(request):
    if request.method == "GET":  # pragma no branch
        linklinkuser = request.user.linklinkuser
        chat_room_list = \
            ChatRoom.objects.filter(name__contains=f"[{linklinkuser.id}]")
        response_dict = {"chatRoomInfoList": []}
        for chat_room in chat_room_list:
            # Send chat rooms that contain at least one message
            if len(chat_room.messages.all()) > 0:
                chat_room_dict = {}
                chat_room_dict["chatRoomName"] = \
                    chat_room.name.replace("[", "").replace("]", "")
                user_id_1, user_id_2 = map(
                    int,
                    chat_room.name.replace("[", "").replace("]", "").split("__")
                )

                other_user_id = \
                    user_id_2 if linklinkuser.id == user_id_1 else user_id_1
                chat_room_dict["otherUserId"] = other_user_id
                other_user = LinkLinkUser.objects.get(id=other_user_id)
                chat_room_dict["otherUserName"] = (
                    other_user.user.last_name + other_user.user.first_name
                )
                chat_room_dict["otherUserImgUrl"] = other_user.profile.imgUrl
                last_message = \
                    chat_room.messages.all().order_by("-timeStamp")[0]
                chat_room_dict["senderId"] = last_message.sender.id
                chat_room_dict["lastMessage"] = last_message.content
                chat_room_dict["isRead"] = last_message.read
                chat_room_dict["lastTimeStamp"] = last_message.timeStamp

                response_dict["chatRoomInfoList"].append(chat_room_dict)
        response_dict["chatRoomInfoList"].sort(
            key=lambda x: x["lastTimeStamp"],
            reverse=True
        )
        return JsonResponse(status=200, data=response_dict)


@allowed_method_or_405(["GET"])
@logged_in_or_401
def chat(request, chat_room_name):
    if request.method == "GET":  # pragma no branch
        linklinkuser = request.user.linklinkuser
        user_id_1, user_id_2 = map(int, chat_room_name.split("__"))
        try:
            chat_room = \
                ChatRoom.objects.get(name=f"[{user_id_1}]__[{user_id_2}]")
        except ChatRoom.DoesNotExist:
            return JsonResponse(
                status=404,
                data={
                    "message": (
                        f"ChatRoom [{user_id_1}]__[{user_id_2}] not found."
                        "Refresh may solve the race issue."
                    )
                },
            )
        response_dict = {}
        response_dict["chatRoomName"] = chat_room_name
        other_user_id = user_id_2 if linklinkuser.id == user_id_1 else user_id_1
        other_user = LinkLinkUser.objects.get(id=other_user_id)
        response_dict["otherUserId"] = other_user_id
        response_dict["otherUserName"] = \
            other_user.user.last_name + other_user.user.first_name
        response_dict["otherUserImgUrl"] = other_user.profile.imgUrl
        if len(chat_room.messages.all()) > 0:
            last_message = chat_room.messages.all().order_by("-timeStamp")[0]
            response_dict["lastMessage"] = last_message.content
            response_dict["lastTimeStamp"] = last_message.timeStamp
        else:
            response_dict["lastMessage"] = ""
            response_dict["lastTimeStamp"] = ""
        return JsonResponse(status=200, data=response_dict)
