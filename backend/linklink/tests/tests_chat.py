"""
Search test module for linklink app
"""

from datetime import datetime, timedelta
import json
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.utils import timezone

from ..models import (
    LinkLinkUser,
    Verification,
    ChatRoom,
    Message,
    Profile,
)


class LinkLinkUserSearchTestCase(TestCase):
    """
    Test for linklinkuser search
    """

    def setUp(self):
        john = User.objects.create_user(
            username="john",
            password="johnpassword",
            # email="notiona@snu.ac.kr",
            first_name="John",
            last_name="Cena",
        )
        james = User.objects.create_user(
            username="james",
            password="jamespassword",
            # email="notiona@snu.ac.kr",
            first_name="James",
            last_name="Gunn",
        )
        emily = User.objects.create_user(
            username="emily",
            password="emilypassword",
            # email="notiona@snu.ac.kr",
            first_name="Emily",
            last_name="Blunt",
        )
        john_linklinkuser = LinkLinkUser.objects.create(
            user=john,
            emailValidated=False,
            email_unique="notiona@snu.ac.kr",
        )
        james_linklinkuser = LinkLinkUser.objects.create(
            user=james,
            emailValidated=False,
            email_unique="invalid_but_unique1@snu.ac.kr",
        )
        LinkLinkUser.objects.create(
            user=emily,
            emailValidated=False,
            email_unique="invalid_but_unique2@snu.ac.kr",
        )
        expire_time = datetime.now() + timedelta(days=settings.EMAIL_EXPIRE_DAYS)
        expire_time = expire_time.astimezone(timezone.get_default_timezone())
        Verification.objects.create(
            linklinkuser=john_linklinkuser, purpose="Register", expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=james_linklinkuser, purpose="Register", expiresAt=expire_time
        )

        # Initialize frequently used member variables
        self.client = Client(enforce_csrf_checks=True)
        self.csrftoken = self.client.get("/api/csrf_token/").cookies["csrftoken"].value
        self.linklink_path = os.path.dirname(os.path.realpath(__file__))

    def test_chat(self):
        target_url = "/api/chat/"
        self.client.login(username="john", password="johnpassword")
        # Create Profile
        john_linklinkuser = LinkLinkUser.objects.get(id=1)
        Profile.objects.create(
            linklinkuser=john_linklinkuser,
            introduction="This is john",
            website="johnwebsite.com",
            imgUrl="https://catimage.com",
        )

        james_linklinkuser = LinkLinkUser.objects.get(id=2)
        Profile.objects.create(
            linklinkuser=james_linklinkuser,
            introduction="This is James",
            website="jameswebsite.com",
            imgUrl="https://catimage.com",
        )
        emily_linklinkuser = LinkLinkUser.objects.get(id=3)
        Profile.objects.create(
            linklinkuser=emily_linklinkuser,
            introduction="This is Emily",
            website="emilywebsite.com",
            imgUrl="https://catimage.com",
        )

        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {"chatRoomInfoList": []}
        self.assertEqual(response_dict, response_answer)

        chatroom = ChatRoom.objects.create(name="[1]__[2]")

        chatroom.join(john_linklinkuser)
        chatroom.leave(john_linklinkuser)

        ChatRoom.objects.create(name="[1]__[3]")

        message = Message.objects.create(
            chatRoom=chatroom,
            sender=john_linklinkuser,
            receiver=james_linklinkuser,
            content="Test Message",
        )
        message.timeStamp = "2022-12-13T13:42:39.118Z"
        message.save()

        response = self.client.get(target_url + "1__2/")
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "chatRoomName": "1__2",
            "otherUserId": 2,
            "otherUserName": "GunnJames",
            "otherUserImgUrl": "https://catimage.com",
            "lastMessage": "Test Message",
            "lastTimeStamp": "2022-12-13T13:42:39.118Z",
        }
        self.assertEqual(response_dict, response_answer)

        response = self.client.get(target_url + "1__4/")
        self.assertEqual(response.status_code, 404)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "message": "ChatRoom [1]__[4] not found.Refresh may solve the race issue."
        }
        self.assertEqual(response_dict, response_answer)

        response = self.client.get(target_url + "1__3/")
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "chatRoomName": "1__3",
            "otherUserId": 3,
            "otherUserName": "BluntEmily",
            "otherUserImgUrl": "https://catimage.com",
            "lastMessage": "",
            "lastTimeStamp": "",
        }
        self.assertEqual(response_dict, response_answer)

        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "chatRoomInfoList": [
                {
                    "chatRoomName": "1__2",
                    "otherUserId": 2,
                    "senderId": 1,
                    "otherUserName": "GunnJames",
                    "otherUserImgUrl": "https://catimage.com",
                    "lastMessage": "Test Message",
                    "isRead": False,
                    "lastTimeStamp": "2022-12-13T13:42:39.118Z",
                }
            ]
        }
        self.assertEqual(response_dict, response_answer)
