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
    views_tags,
    views_account,
    views_search,
    views_forgot,
)

urlpatterns = [
    path("csrf_token/", views_auth.csrf_token, name="csrf_token"),
    path("auth/signup/", views_auth.signup, name="signup"),
    path("auth/signin/", views_auth.signin, name="signin"),
    path("auth/signout/", views_auth.signout, name="signout"),
    path("auth/verify/<str:token>/", views_auth.verify, name="verify"),
    path("auth/session/", views_auth.auto_signin, name="auto_signin"),
    path(
        "auth/email/",
        views_auth.check_email_unique,
        name="check_email_unique"
    ),
    path(
        "auth/username/",
        views_auth.check_username_unique,
        name="check_username_unique"
    ),
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
    path(
        "friendRequestToken/",
        views_friend_request.friend_request_token_send,
        name="friend_request_token_send",
    ),
    path("chat/", views_chat.chat_list, name="chat_list"),
    path("chat/<str:chat_room_name>/", views_chat.chat, name="chat"),
    path(
        "skillTags/",
        views_tags.skill_tag_list,
        name="skill_tags_list"
    ),
    path(
        "qualityTags/",
        views_tags.quality_tag_list,
        name="quality_tags_list"
    ),
    path(
        "qualityTags/<int:user_id>/",
        views_tags.quality_tag,
        name="quality_tag",
    ),
    path(
        "account/",
        views_account.account_info,
        name="account_info"
    ),
    path(
        "account/password/",
        views_account.password_reset,
        name="password_reset"
    ),
    path(
        "searchFriends/<str:search_keys>/",
        views_search.search_friends,
        name="search_friends"
    ),
    path(
        "forgot/username/",
        views_forgot.forgot_username,
        name="forgot_username"
    ),
    path(
        "forgot/password/",
        views_forgot.forgot_password,
        name="forgot_password"
    ),
]
