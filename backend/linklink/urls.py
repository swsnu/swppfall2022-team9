"""
url module for linklink app
"""

from django.urls import path
from linklink import views

urlpatterns = [
    path('csrf_token/', views.csrf_token, name='csrf_token'),
    path('auth/signup/', views.signup, name='signup'),
    path('auth/signin/', views.signin, name='signin'),
    path('auth/signout/', views.signout, name='signout'),
    path('auth/verify/<str:token>/', views.verify, name='verify'),
    path('user/onechon/', views.onechon, name='onechon'),
]
