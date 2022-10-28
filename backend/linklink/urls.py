"""
url module for linklink app
"""

from django.urls import path
from linklink import views

urlpatterns = [
    path('test-email/', views.email_test, name='email_test'),
    path('user/onechon/', views.onechon, name='onechon'),
]