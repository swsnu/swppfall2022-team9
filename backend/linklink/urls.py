"""
url module for linklink app
"""

from django.urls import path
from linklink import views
from linklink.views_linklink import views_auth, views_linklinkuser

urlpatterns = [
    path(
        'csrf_token/',
        views_auth.csrf_token,
        name='csrf_token'
    ),
    path(
        'auth/signup/',
        views_auth.signup,
        name='signup'
    ),
    path(
        'auth/signin/',
        views_auth.signin,
        name='signin'
    ),
    path(
        'auth/signout/',
        views_auth.signout,
        name='signout'
    ),
    path(
        'auth/verify/<str:token>/',
        views_auth.verify,
        name='verify'
    ),
    path(
        'auth/session/',
        views_auth.auto_signin,
        name='auto_signin'
    ),
    path(
        'user/friend/',
        views_linklinkuser.friend,
        name='friend'
    ),
    path(
        'user/friendRequestToken/',
        views_linklinkuser.friend_request_token,
        name='friend_request_token'
    ),
    path(
        'profile/',
        views.my_profile,
        name='my_profile'
    ),
    path(
        'profile/<int:user_id>/',
        views.profile,
        name='profile'
    ),
    path(
        'profile/uploadImage/',
        views.upload_image,
        name='upload_image'
    ),
    path(
        'friendRequest/',
        views.friend_request,
        name='friend_request'
    ),
    path(
        'friendRequest/<int:friend_request_id>/',
        views.friend_request_respond,
        name='friend_request_respond'
    ),
]
