"""
models module for linklink app
"""

import uuid

from django.db import models
from django.conf import settings

from .tags_list import tags


# --------------------------------------------------------------------------
#   LinkLinkUser Related Models
# --------------------------------------------------------------------------


class LinkLinkUser(models.Model):
    """
    LinkLinkUser model class that extends django's User
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    friendRequestToken = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True
    )
    emailValidated = models.BooleanField(default=False)
    email_unique = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.user.last_name + self.user.first_name}"


class FriendRequest(models.Model):
    """
    FriendRequest model class with 3 status
    """

    senderId = models.ForeignKey(
        LinkLinkUser,
        on_delete=models.CASCADE,
        related_name="senderIdFriendRequest",  # avoid fields.E304 error
    )
    getterId = models.ForeignKey(
        LinkLinkUser,
        on_delete=models.CASCADE,
        related_name="getterIdFriendRequest",  # avoid fields.E304 error
    )
    FRIEND_REQUEST_STATUS = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]
    status = models.CharField(
        max_length=8, choices=FRIEND_REQUEST_STATUS, default="Pending"
    )
    unique_request_id = models.CharField(
        max_length=100,
        unique=True,
        editable=False,
    )
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.senderId}->{self.getterId}, status:{self.status}"

    def save(self, *args, **kwargs):
        self.unique_request_id = "-".join(
            [
                str(min(self.senderId.id, self.getterId.id)),
                str(max(self.senderId.id, self.getterId.id)),
            ]
        )
        # pylint: disable=super-with-arguments
        super(FriendRequest, self).save(*args, **kwargs)


class Verification(models.Model):
    """
    Verification model class
    """

    linklinkuser = models.ForeignKey(LinkLinkUser, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    expiresAt = models.DateTimeField()
    PURPOSE = [
        ("Register", "Register"),
        ("Password", "Password"),
    ]
    purpose = models.CharField(
        max_length=8,
        choices=PURPOSE,
        default="Register"
    )

    def __str__(self):
        return "_".join(
            [self.linklinkuser.user.username, self.purpose, str(self.token)]
        )


# --------------------------------------------------------------------------
#   Profile Related Models
# --------------------------------------------------------------------------


class SkillTag(models.Model):
    """
    SkillTag model class
    """

    SKILL_TAGS_LIST = tags.SKILL_TAGS
    name = models.CharField(
        max_length=30,
        choices=[(skill_tag, skill_tag) for skill_tag in SKILL_TAGS_LIST],
    )

    def __str__(self):
        return self.name


class QualityTag(models.Model):
    """
    QualityTag model class
    """

    QUALITY_TAGS_LIST = tags.QUALITY_TAGS
    name = models.CharField(
        max_length=30,
        choices=[
            (quality_tag, quality_tag)
            for quality_tag in QUALITY_TAGS_LIST
        ],
    )

    def __str__(self):
        return self.name


class Profile(models.Model):
    """
    Profile model class
    """

    linklinkuser = models.OneToOneField(LinkLinkUser, on_delete=models.CASCADE)
    introduction = models.TextField()
    imgUrl = models.CharField(max_length=400, blank=True)
    website = models.CharField(max_length=100, blank=True)
    skillTags = models.ManyToManyField(SkillTag)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        user = self.linklinkuser.user
        return f"{user.last_name + user.first_name}'s profile"


class Education(models.Model):
    """
    Education model class
    """

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    school = models.CharField(max_length=50)
    major = models.CharField(max_length=50)
    dateStart = models.DateField()
    dateEnd = models.DateField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.school}-{self.major}"


class JobExperience(models.Model):
    """
    JobExperience model class
    """

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    company = models.CharField(max_length=50)
    position = models.CharField(max_length=50)
    dateStart = models.DateField()
    dateEnd = models.DateField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company}-{self.position}"


#--------------------------------------------------------------------------
#   SkillTag, QualityTag Related Models
#--------------------------------------------------------------------------

class QualityTagRequest(models.Model):
    """
    QualityTagRequest model class
    """
    QUALITY_TAGS_LIST = tags.QUALITY_TAGS
    name = models.CharField(
        max_length=30,
        choices=[
            (quality_tag, quality_tag) for quality_tag in QUALITY_TAGS_LIST
        ],
    )
    senderId = models.ForeignKey(
        LinkLinkUser,
        on_delete=models.CASCADE,
        related_name="senderIdQualityTagRequest", # avoid fields.E304 error
    )
    getterId = models.ForeignKey(
        LinkLinkUser,
        on_delete=models.CASCADE,
        related_name="getterIdQualityTagRequest", # avoid fields.E304 error
    )
    status = models.BooleanField(default=False)
    unique_request_id = models.CharField(
        max_length=100,
        unique=True,
        editable=False,
    )
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"{self.senderId}->{self.getterId}, "
            f"name:{self.name}, status:{self.status}"
        )

    def save(self, *args, **kwargs):
        self.unique_request_id = "-".join([
            str(self.senderId.id),
            str(self.getterId.id),
            self.name,
        ])
        # pylint: disable=super-with-arguments
        super(QualityTagRequest, self).save(*args, **kwargs)


#--------------------------------------------------------------------------
#   Chat Related Models
# --------------------------------------------------------------------------


class ChatRoom(models.Model):
    """
    ChatRoom model class
    """

    name = models.CharField(max_length=128)
    online = models.ManyToManyField(to=LinkLinkUser, blank=True)

    def get_online_count(self):
        return self.online.count()

    def join(self, link_link_user):
        self.online.add(link_link_user)
        self.save()

    def leave(self, link_link_user):
        self.online.remove(link_link_user)
        self.save()

    def __str__(self):
        return f"{self.name} ({self.get_online_count()})"


class Message(models.Model):
    """
    Message model class
    """

    chatRoom = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        LinkLinkUser, on_delete=models.CASCADE, related_name="messages_from_me"
    )
    receiver = models.ForeignKey(
        LinkLinkUser, on_delete=models.CASCADE, related_name="messages_to_me"
    )
    content = models.CharField(max_length=512)
    timeStamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return (
            f"From {self.sender} to {self.receiver}: \
                {self.content} [{self.timeStamp}]"
        )
