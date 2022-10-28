"""
admin module for linklink app
"""

from django.contrib import admin
from .models import LinkLinkUser, FriendRequest, Verification

admin.site.register(LinkLinkUser)
admin.site.register(FriendRequest)
admin.site.register(Verification)
