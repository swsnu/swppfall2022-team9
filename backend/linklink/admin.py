"""
admin module for linklink app
"""

from django.contrib import admin
from .models import (
    LinkLinkUser,
    FriendRequest,
    Verification,
    Profile,
    SkillTag,
    QualityTag,
    Education,
    JobExperience,
    ChatRoom,
    Message,
)

admin.site.register(LinkLinkUser)
admin.site.register(FriendRequest)
admin.site.register(Verification)
admin.site.register(Profile)
admin.site.register(SkillTag)
admin.site.register(QualityTag)
admin.site.register(Education)
admin.site.register(JobExperience)
admin.site.register(ChatRoom)
admin.site.register(Message)
