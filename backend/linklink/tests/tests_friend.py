"""
Friend test module for linklink app
"""

from datetime import datetime, timedelta
import inspect
import json
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.utils import timezone

from ..models import (
    LinkLinkUser,
    FriendRequest,
    Verification,
    SkillTag,
    QualityTag,
    Profile,
)


class LinkLinkFriendTestCase(TestCase):
    """
    Friend related TestCase to test various LinkLink REST APIs
    """
    def setUp(self):
        # Create 5 Users
        john = User.objects.create_user(
            username="john",
            password="johnpassword",
            #email="notiona@snu.ac.kr",
            first_name="John",
            last_name="Cena"
        )
        james = User.objects.create_user(
            username="james",
            password="jamespassword",
            #email="notiona@snu.ac.kr",
            first_name="James",
            last_name="Gunn"
        )
        emily = User.objects.create_user(
            username="emily",
            password="emilypassword",
            #email="notiona@snu.ac.kr",
            first_name="Emily",
            last_name="Blunt"
        )
        will = User.objects.create_user(
            username="will",
            password="willpassword",
            #email="notiona@snu.ac.kr",
            first_name="Will",
            last_name="Smith"
        )
        chris = User.objects.create_user(
            username="chris",
            password="chrispassword",
            #email="notiona@snu.ac.kr",
            first_name="Chris",
            last_name="Rock"
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
        emily_linklinkuser = LinkLinkUser.objects.create(
            user=emily,
            emailValidated=False,
            email_unique="invalid_but_unique2@snu.ac.kr",
        )
        will_linklinkuser = LinkLinkUser.objects.create(
            user=will,
            emailValidated=False,
            email_unique="invalid_but_unique3@snu.ac.kr",
        )
        chris_linklinkuser = LinkLinkUser.objects.create(
            user=chris,
            emailValidated=False,
            email_unique="invalid_but_unique4@snu.ac.kr",
        )
        expire_time = \
            datetime.now() + timedelta(days=settings.EMAIL_EXPIRE_DAYS)
        expire_time= expire_time.astimezone(timezone.get_default_timezone())
        Verification.objects.create(
            linklinkuser=john_linklinkuser,
            purpose="Register",
            expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=james_linklinkuser,
            purpose="Register",
            expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=emily_linklinkuser,
            purpose="Register",
            expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=will_linklinkuser,
            purpose="Register",
            expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=chris_linklinkuser,
            purpose="Register",
            expiresAt=expire_time
        )
        SkillTag.objects.create(
            name="Frontend"
        )
        SkillTag.objects.create(
            name="Backend"
        )
        SkillTag.objects.create(
            name="DevOps"
        )
        QualityTag.objects.create(
            name="Sincere"
        )
        QualityTag.objects.create(
            name="Loyal"
        )
        QualityTag.objects.create(
            name="Intelligent"
        )
        # Initialize frequently used member variables
        self.client = Client(enforce_csrf_checks=True)
        self.csrftoken = \
            self.client.get("/api/csrf_token/").cookies["csrftoken"].value
        self.linklink_path = os.path.dirname(os.path.realpath(__file__))

#--------------------------------------------------------------------------
#   Friend (Onechon+Twochon) Related Tests
#--------------------------------------------------------------------------

    def test_get_friend_general_success(self):
        target_url = "/api/user/friend/"
        # Initialize Connection
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        will_linklinkuser = LinkLinkUser.objects.get(pk=4)
        chris_linklinkuser = LinkLinkUser.objects.get(pk=5)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=emily_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=will_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=chris_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=chris_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        Profile.objects.create(
            linklinkuser=john_linklinkuser,
            introduction="This is john",
            imgUrl="https://catimage.com",
        )
        Profile.objects.create(
            linklinkuser=james_linklinkuser,
            introduction="This is james",
            imgUrl="https://catimage.com",
        )
        Profile.objects.create(
            linklinkuser=emily_linklinkuser,
            introduction="This is emily",
            imgUrl="https://catimage.com",
        )
        Profile.objects.create(
            linklinkuser=will_linklinkuser,
            introduction="This is will",
            imgUrl="https://catimage.com",
        )
        Profile.objects.create(
            linklinkuser=chris_linklinkuser,
            introduction="This is chris",
            imgUrl="https://catimage.com",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200) # Successful GET
        answer_json_path = os.path.join(
            self.linklink_path,
            "../test_answers",
            inspect.stack()[0][3] + ".json" # current method name
        )
        with open(answer_json_path, "r", encoding="utf") as json_file:
            expected_json = json.load(json_file)
        self.assertEqual( # Expected response assert
            json.loads(response.content.decode()),
            expected_json
        )


    def test_get_friend_no_friend_success(self):
        target_url = "/api/user/friend/"
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200) # Successful GET
        answer_json_path = os.path.join(
            self.linklink_path,
            "../test_answers",
            inspect.stack()[0][3] + ".json" # current method name
        )
        with open(answer_json_path, "r", encoding="utf") as json_file:
            expected_json = json.load(json_file)
        self.assertEqual( # Expected response assert
            json.loads(response.content.decode()),
            expected_json
        )


    def test_get_friend_only_onechon_success(self):
        target_url = "/api/user/friend/"
        # Initialize Connection
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        will_linklinkuser = LinkLinkUser.objects.get(pk=4)
        chris_linklinkuser = LinkLinkUser.objects.get(pk=5)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=will_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=chris_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        Profile.objects.create(
            linklinkuser=john_linklinkuser,
            introduction="This is john",
            imgUrl="https://catimage.com",
        )
        Profile.objects.create(
            linklinkuser=james_linklinkuser,
            introduction="This is james",
            imgUrl="https://catimage.com",
        )
        Profile.objects.create(
            linklinkuser=emily_linklinkuser,
            introduction="This is emily",
            imgUrl="https://catimage.com",
        )
        Profile.objects.create(
            linklinkuser=will_linklinkuser,
            introduction="This is will",
            imgUrl="https://catimage.com",
        )
        Profile.objects.create(
            linklinkuser=chris_linklinkuser,
            introduction="This is chris",
            imgUrl="https://catimage.com",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200) # Successful GET
        answer_json_path = os.path.join(
            self.linklink_path,
            "../test_answers",
            inspect.stack()[0][3] + ".json" # current method name
        )
        with open(answer_json_path, "r", encoding="utf") as json_file:
            expected_json = json.load(json_file)
        self.assertEqual( # Expected response assert
            json.loads(response.content.decode()),
            expected_json
        )


    def test_get_friend_request_token_success(self):
        target_url = "/api/user/friendRequestToken/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        friend_request_token = response_dict["friendRequestToken"]
        self.assertEqual(36, len(friend_request_token))

#--------------------------------------------------------------------------
#   405 Checking Tests
#--------------------------------------------------------------------------

    def test_405_friend(self):
        target_url = "/api/user/friend/"
        # PUT
        response = self.client.put(
            target_url,
            {},
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 405)  # Method not allowed
        # Other Random Request Method
        self.client.patch(
            target_url,
            {},
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 405)  # Method not allowed

#--------------------------------------------------------------------------
#   401 Checking Tests
#--------------------------------------------------------------------------

    def test_401_friend(self):
        target_url = "/api/user/friend/"
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 401)  # Unauthorized
