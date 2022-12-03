"""
url module for linklink app
"""

from django.urls import path
from linklink.views import (
    views_auth,
    views_friend,
    views_profile,
    views_friend_request,
    views_chat,
)

urlpatterns = [
    path("csrf_token/", views_auth.csrf_token, name="csrf_token"),
    path("auth/signup/", views_auth.signup, name="signup"),
    path("auth/signin/", views_auth.signin, name="signin"),
    path("auth/signout/", views_auth.signout, name="signout"),
    path("auth/verify/<str:token>/", views_auth.verify, name="verify"),
    path("auth/session/", views_auth.auto_signin, name="auto_signin"),
    path("user/friend/", views_friend.friend, name="friend"),
    path(
        "user/friendRequestToken/",
        views_friend.friend_request_token,
        name="friend_request_token",
    ),
    path("profile/", views_profile.my_profile, name="my_profile"),
    path("profile/<int:user_id>/", views_profile.profile, name="profile"),
    path("profile/uploadImage/",
        views_profile.upload_image,
        name="upload_image"
    ),
    path("friendRequest/",
        views_friend_request.friend_request,
        name="friend_request"
    ),
    path(
        "friendRequest/<int:friend_request_id>/",
        views_friend_request.friend_request_respond,
        name="friend_request_respond",
    ),
    path("chat/", views_chat.chat_list, name="chat_list"),
    path("chat/<str:chat_room_name>/", views_chat.chat, name="chat"),
]
