"""
url module for linklink app
"""

from django.urls import path
from linklink import views

urlpatterns = [
    path('token/', views.token, name='token'),
    path('auth/send_email/', views.send_email, name='send_email'),
    path('auth/signup/', views.signup, name='signup'),
    path('auth/signin/', views.signin, name='signin'),
    path('auth/signout/', views.signout, name='signout'),
    path('user/onechon/', views.onechon, name='onechon'),
]
