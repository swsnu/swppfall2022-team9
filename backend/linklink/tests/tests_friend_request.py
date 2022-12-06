"""
FriendRequest related test module for linklink app
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


class LinkLinkFriendRequestTestCase(TestCase):
    """
    FriendRequest related TestCase to test various LinkLink REST APIs
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
            name="성실한"
        )
        QualityTag.objects.create(
            name="정직한"
        )
        QualityTag.objects.create(
            name="논리적인"
        )
        # Initialize frequently used member variables
        self.client = Client(enforce_csrf_checks=True)
        self.csrftoken = \
            self.client.get("/api/csrf_token/").cookies["csrftoken"].value
        self.linklink_path = os.path.dirname(os.path.realpath(__file__))

#--------------------------------------------------------------------------
#   FriendRequest Related Tests
#--------------------------------------------------------------------------

    def test_get_all_my_pending_friend_request_empty_sucess(self):
        target_url = "/api/friendRequest/"
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


    def test_get_all_my_pending_friend_request_general_sucess(self):
        target_url = "/api/friendRequest/"
        # Initialize Connection
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        will_linklinkuser = LinkLinkUser.objects.get(pk=4)
        chris_linklinkuser = LinkLinkUser.objects.get(pk=5)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Pending",
        )
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=emily_linklinkuser,
            status="Pending",
        )
        FriendRequest.objects.create(
            senderId=will_linklinkuser,
            getterId=john_linklinkuser,
            status="Pending",
        )
        FriendRequest.objects.create(
            senderId=chris_linklinkuser,
            getterId=john_linklinkuser,
            status="Pending",
        )
        FriendRequest.objects.create(
            senderId=chris_linklinkuser,
            getterId=james_linklinkuser,
            status="Pending",
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


    def test_get_specific_pending_friend_request_sucess(self):
        target_url = "/api/friendRequest/?user1Id=1&user2Id=2"
        # Initialize Connection
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Pending",
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


    def test_get_specific_accepted_friend_request_sucess(self):
        target_url = "/api/friendRequest/?user1Id=1&user2Id=2"
        # Initialize Connection
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
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


    def test_get_specific_rejected_friend_request_sucess(self):
        target_url = "/api/friendRequest/?user1Id=1&user2Id=2"
        # Initialize Connection
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Rejected",
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


    def test_post_new_friend_request_success(self):
        target_url = "/api/friendRequest/"
        # Initialize Connection
        # john-james james-emily onechon
        # Create new friendRequest to john->emily
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
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
        # Save initial object count
        friend_request_count = FriendRequest.objects.count()
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # POST
        response = self.client.post(
            target_url,
            {
                "getterId": 3
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 201)
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
        self.assertTrue(FriendRequest.objects.filter(id=friend_request_count+1
            ).exists())
        new_friend_request = \
            FriendRequest.objects.get(id=friend_request_count+1)
        self.assertEqual(new_friend_request.senderId, john_linklinkuser)
        self.assertEqual(new_friend_request.getterId, emily_linklinkuser)
        self.assertEqual(new_friend_request.status, "Pending")


    def test_put_friend_request_accepted_to_accepted_success(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Accepted -> Accepted
        # "No Change" Case
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Accepted"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Accepted")


    def test_put_friend_request_accepted_to_pending_not_allowed(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Accepted -> Pending
        # "Not Allowed" Case
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Pending"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        # Check response
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "State Transition: Accepted->Pending not allowed."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Accepted")


    def test_put_friend_request_accepted_to_rejected_sender_success(self):
        target_url = "/api/friendRequest/1/"
        # john->james onechon
        # Accepted -> Rejected
        # "Both" Case, sender Reject
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Rejected"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, john_linklinkuser)
        self.assertEqual(friend_request_found.getterId, james_linklinkuser)
        self.assertEqual(friend_request_found.status, "Rejected")


    def test_put_friend_request_accepted_to_rejected_getter_success(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Accepted -> Rejected
        # "Both" Case, getter Reject
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Rejected"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Rejected")


    def test_put_friend_request_pending_to_accepted_success(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Pending -> Accepted
        # "Getter" Case
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Pending",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Accepted"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Accepted")


    def test_put_friend_request_pending_to_pending_success(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Pending -> Pending
        # "No Change" Case
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Pending",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Pending"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Pending")


    def test_put_friend_request_pending_to_rejected_success(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Pending -> Rejected
        # "Getter" Case
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Pending",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Rejected"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Rejected")


    def test_put_friend_request_rejected_to_accepted_not_allowed(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Rejected -> Accepted
        # "Not Allowed" Case
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Rejected",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Accepted"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        # Check response
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "State Transition: Rejected->Accepted not allowed."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Rejected")


    def test_put_friend_request_rejected_to_pending_getter_success(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Rejected -> Pending
        # "Both*" Case, getter sends new request
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Rejected",
        )
        # john and james need to be within twochon
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=emily_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=emily_linklinkuser,
            status="Accepted",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Pending"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        # sender getter should switch
        self.assertEqual(friend_request_found.senderId, john_linklinkuser)
        self.assertEqual(friend_request_found.getterId, james_linklinkuser)
        self.assertEqual(friend_request_found.status, "Pending")


    def test_put_friend_request_rejected_to_pending_sender_success(self):
        target_url = "/api/friendRequest/1/"
        # john->james onechon
        # Rejected -> Pending
        # "Both*" Case, sender sends new request
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Rejected",
        )
        # john and james need to be within twochon
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=emily_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=emily_linklinkuser,
            status="Accepted",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Pending"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, john_linklinkuser)
        self.assertEqual(friend_request_found.getterId, james_linklinkuser)
        self.assertEqual(friend_request_found.status, "Pending")


    def test_put_friend_request_rejected_to_rejected_success(self):
        target_url = "/api/friendRequest/1/"
        # james->john onechon
        # Rejected -> Rejected
        # "No Change" Case
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Rejected",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Rejected"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
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
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Rejected")


    def test_friend_request_token_add_pending_request_success(self):
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        james_token = james_linklinkuser.friendRequestToken
        target_url = f"/api/friendRequestToken/?token={james_token}"
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # FriendRequest DB Object Check
        friend_request_found = FriendRequest.objects.get(id=1)
        self.assertEqual(friend_request_found.senderId, james_linklinkuser)
        self.assertEqual(friend_request_found.getterId, john_linklinkuser)
        self.assertEqual(friend_request_found.status, "Pending")


    def test_friend_request_token_no_token_query(self):
        target_url = "/api/friendRequestToken/?"
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)
        error_message_dict = {
            "message":
            "token query not found in url"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_friend_request_token_invalid_token(self):
        target_url = "/api/friendRequestToken/?token=asdf"
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 404)
        error_message_dict = {
            "message":
            "user not found for token: asdf"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_friend_request_token_to_self(self):
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        john_token = john_linklinkuser.friendRequestToken
        target_url = f"/api/friendRequestToken/?token={john_token}"
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "cannot send FriendRequest to self"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_friend_request_token_already_exists_as_accepted(self):
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        james_token = james_linklinkuser.friendRequestToken
        target_url = f"/api/friendRequestToken/?token={james_token}"
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # Init FriendRequest
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        # PUT
        response = self.client.put(
            target_url,
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # Check DB
        friend_request_found = FriendRequest.objects.get(pk=1)
        self.assertEqual(friend_request_found.status, "Accepted")
        self.assertEqual(str(friend_request_found.senderId), "CenaJohn")
        self.assertEqual(str(friend_request_found.getterId), "GunnJames")


    def test_friend_request_token_already_exists_as_pending(self):
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        james_token = james_linklinkuser.friendRequestToken
        target_url = f"/api/friendRequestToken/?token={james_token}"
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # Init FriendRequest
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Pending",
        )
        # PUT
        response = self.client.put(
            target_url,
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # Check DB
        friend_request_found = FriendRequest.objects.get(pk=1)
        self.assertEqual(friend_request_found.status, "Pending")
        # sender getter should be switched
        self.assertEqual(str(friend_request_found.senderId), "GunnJames")
        self.assertEqual(str(friend_request_found.getterId), "CenaJohn")


    def test_friend_request_token_already_exists_as_rejected(self):
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        james_token = james_linklinkuser.friendRequestToken
        target_url = f"/api/friendRequestToken/?token={james_token}"
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # Init FriendRequest
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Rejected",
        )
        # PUT
        response = self.client.put(
            target_url,
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # Check DB
        friend_request_found = FriendRequest.objects.get(pk=1)
        # status should change to Pending
        self.assertEqual(friend_request_found.status, "Pending")
        # sender getter should be switched
        self.assertEqual(str(friend_request_found.senderId), "GunnJames")
        self.assertEqual(str(friend_request_found.getterId), "CenaJohn")


    def test_get_specific_friend_request_only_user_1_query(self):
        target_url = "/api/friendRequest/?user1Id=1"
        # Initialize Connection
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Rejected",
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
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 405)
        error_message_dict = {
            "message": "invalid query param"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_get_specific_friend_request_no_read_permission(self):
        target_url = "/api/friendRequest/?user1Id=2&user2Id=3"
        # Initialize Connection
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status="Rejected",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message": (
                "No read permission for FriendRequest "
                "user1Id=2, user2Id=3."
            )
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_get_specific_friend_request_does_not_exist(self):
        target_url = "/api/friendRequest/?user1Id=1&user2Id=2"
        # user is in (1, 2) but FriendRequest does not exist
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 404)
        error_message_dict = {
            "message": (
                "FriendRequest user1Id=1, "
                "user2Id=2 not found."
            )
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_post_friend_request_already_exists_as_accepted(self):
        target_url = "/api/friendRequest/"
        # Initialize Connection
        # john-james james-emily onechon, john-emily onechon
        # Create new friendRequest to john->emily
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
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
        # Save initial object count
        friend_request_count = FriendRequest.objects.count()
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # POST
        response = self.client.post(
            target_url,
            {
                "getterId": 3
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            (
                "FriendRequest already exists between "
                "user1Id=CenaJohn, user2Id=BluntEmily."
            )
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # DB check to see no change
        self.assertTrue(FriendRequest.objects.filter(
            id=friend_request_count).exists()
        )
        new_friend_request = \
            FriendRequest.objects.get(id=friend_request_count)
        self.assertEqual(new_friend_request.senderId, emily_linklinkuser)
        self.assertEqual(new_friend_request.getterId, john_linklinkuser)
        self.assertEqual(new_friend_request.status, "Accepted")


    def test_post_friend_request_already_exists_as_pending(self):
        target_url = "/api/friendRequest/"
        # Initialize Connection
        # john-james james-emily onechon, john-emily onechon
        # Create new friendRequest to john->emily
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=john_linklinkuser,
            status="Pending",
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
        # Save initial object count
        friend_request_count = FriendRequest.objects.count()
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # POST
        response = self.client.post(
            target_url,
            {
                "getterId": 3
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            (
                "FriendRequest already exists between "
                "user1Id=CenaJohn, user2Id=BluntEmily."
            )
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # DB check to see no change
        self.assertTrue(FriendRequest.objects.filter(
            id=friend_request_count).exists()
        )
        new_friend_request = \
            FriendRequest.objects.get(id=friend_request_count)
        self.assertEqual(new_friend_request.senderId, emily_linklinkuser)
        self.assertEqual(new_friend_request.getterId, john_linklinkuser)
        self.assertEqual(new_friend_request.status, "Pending")


    def test_post_friend_request_already_exists_as_rejected(self):
        target_url = "/api/friendRequest/"
        # Initialize Connection
        # john-james james-emily onechon, john-emily onechon
        # Create new friendRequest to john->emily
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=john_linklinkuser,
            status="Rejected",
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
        # Save initial object count
        friend_request_count = FriendRequest.objects.count()
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # POST
        response = self.client.post(
            target_url,
            {
                "getterId": 3
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            (
                "FriendRequest already exists between "
                "user1Id=CenaJohn, user2Id=BluntEmily."
            )
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # DB check to see no change
        self.assertTrue(FriendRequest.objects.filter(
            id=friend_request_count).exists()
        )
        new_friend_request = \
            FriendRequest.objects.get(id=friend_request_count)
        self.assertEqual(new_friend_request.senderId, emily_linklinkuser)
        self.assertEqual(new_friend_request.getterId, john_linklinkuser)
        self.assertEqual(new_friend_request.status, "Rejected")


    def test_post_friend_request_not_within_twochon(self):
        target_url = "/api/friendRequest/"
        # Initialize Connection
        # john-james onechon,
        # Create new friendRequest to john->emily
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
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
        # Save initial object count
        friend_request_count = FriendRequest.objects.count()
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # POST
        response = self.client.post(
            target_url,
            {
                "getterId": 3
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message": "Two users are not within twochon."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # DB check to see no new FriendRequest
        self.assertFalse(FriendRequest.objects.filter(
            id=friend_request_count+1).exists()
        )


    def test_put_friend_request_not_found(self):
        target_url = "/api/friendRequest/1/"
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Rejected"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 404)
        error_message_dict = {
            "message": "FriendRequest id=1 not found."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_friend_request_getter_p_2_a_no_permission_for_sender(self):
        target_url = "/api/friendRequest/1/"
        # Pending -> Accepted
        # "Getter" Case
        # john is sender
        # john(sender) cannot edit Pending -> Accepted
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Pending",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Accepted"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "Current user has no write permission for FriendRequest id=1."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_friend_request_getter_p_2_a_no_permission_for_anyone(self):
        target_url = "/api/friendRequest/1/"
        # Pending -> Accepted
        # "Getter" Case
        # john is anyone
        # john(anyone) cannot edit Pending -> Accepted
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status="Pending",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Accepted"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "Current user has no write permission for FriendRequest id=1."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_friend_request_getter_p_2_r_no_permission_for_sender(self):
        target_url = "/api/friendRequest/1/"
        # Pending -> Rejected
        # "Getter" Case
        # john is sender
        # john(sender) cannot edit Pending -> Rejected
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Pending",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Rejected"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "Current user has no write permission for FriendRequest id=1."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_friend_request_getter_p_2_r_no_permission_for_anyone(self):
        target_url = "/api/friendRequest/1/"
        # Pending -> Rejected
        # "Getter" Case
        # john is anyone
        # john(anyone) cannot edit Pending -> Rejected
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status="Pending",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Rejected"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "Current user has no write permission for FriendRequest id=1."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_friend_request_both_a_2_r_no_permission_for_anyone(self):
        target_url = "/api/friendRequest/1/"
        # Accepted -> Rejected
        # "Both" Case
        # john is anyone
        # john(anyone) cannot edit Accepted -> Rejected
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Rejected"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "Current user has no write permission for FriendRequest id=1."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_friend_request_both_r_2_p_no_permission_for_anyone(self):
        target_url = "/api/friendRequest/1/"
        # Rejected -> Pending
        # "Both*" Case
        # john is anyone
        # john(anyone) cannot edit Rejected -> Pending
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        FriendRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status="Rejected",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Pending"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "Current user has no write permission for FriendRequest id=1."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_friend_request_both_r_2_p_not_within_twochon(self):
        target_url = "/api/friendRequest/1/"
        # Rejected -> Pending
        # "Both*" Case
        # john is sender, but is not within twochon with james anymore
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Rejected",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Pending"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message": "Two users are not within twochon."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_friend_request_p_2_a_max_onechon_invariant_getter(self):
        target_url = "/api/friendRequest/11/"
        # Pending -> Accepted
        # john already has 10 onechons, trys to get one more
        # should cause max onechon invariant to fail
        # Create 7 more users
        user_6 = User.objects.create_user(
            username="user_6",
            password="user_6password",
            first_name="user_6",
            last_name="user_6_last_name"
        )
        user_7 = User.objects.create_user(
            username="user_7",
            password="user_7password",
            first_name="user_7",
            last_name="user_7_last_name"
        )
        user_8 = User.objects.create_user(
            username="user_8",
            password="user_8password",
            first_name="user_8",
            last_name="user_8_last_name"
        )
        user_9 = User.objects.create_user(
            username="user_9",
            password="user_9password",
            first_name="user_9",
            last_name="Smith"
        )
        user_10 = User.objects.create_user(
            username="user_10",
            password="user_10password",
            first_name="user_10",
            last_name="user_10_last_name"
        )
        user_11 = User.objects.create_user(
            username="user_11",
            password="user_11password",
            first_name="user_11",
            last_name="user_11_last_name"
        )
        user_12 = User.objects.create_user(
            username="user_12",
            password="user_12password",
            first_name="user_12",
            last_name="user_12_last_name"
        )
        user_6_linklinkuser = LinkLinkUser.objects.create(
            user=user_6,
            emailValidated=False,
            email_unique="invalid_but_unique6@snu.ac.kr",
        )
        user_7_linklinkuser = LinkLinkUser.objects.create(
            user=user_7,
            emailValidated=False,
            email_unique="invalid_but_unique7@snu.ac.kr",
        )
        user_8_linklinkuser = LinkLinkUser.objects.create(
            user=user_8,
            emailValidated=False,
            email_unique="invalid_but_unique8@snu.ac.kr",
        )
        user_9_linklinkuser = LinkLinkUser.objects.create(
            user=user_9,
            emailValidated=False,
            email_unique="invalid_but_unique9@snu.ac.kr",
        )
        user_10_linklinkuser = LinkLinkUser.objects.create(
            user=user_10,
            emailValidated=False,
            email_unique="invalid_but_unique10@snu.ac.kr",
        )
        user_11_linklinkuser = LinkLinkUser.objects.create(
            user=user_11,
            emailValidated=False,
            email_unique="invalid_but_unique11@snu.ac.kr",
        )
        user_12_linklinkuser = LinkLinkUser.objects.create(
            user=user_12,
            emailValidated=False,
            email_unique="invalid_but_unique12@snu.ac.kr",
        )
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        will_linklinkuser = LinkLinkUser.objects.get(pk=4)
        chris_linklinkuser = LinkLinkUser.objects.get(pk=5)
        # Init 10 onechon connections for john
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=emily_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=will_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=chris_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=user_6_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=user_7_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=user_8_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=user_9_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=user_10_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=user_11_linklinkuser,
            status="Accepted",
        )
        # Init one Pending request
        FriendRequest.objects.create(
            senderId=user_12_linklinkuser,
            getterId=john_linklinkuser,
            status="Pending",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Accepted"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        friend_request_new = FriendRequest.objects.get(pk=11)
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message": (
                "Onechon Invariant Failed for CenaJohn. "
                "Onechon list length: 10 "
                "Onechon list of CenaJohn:"
                "[<LinkLinkUser: GunnJames>, "
                "<LinkLinkUser: BluntEmily>, <LinkLinkUser: SmithWill>, "
                "<LinkLinkUser: RockChris>, <LinkLinkUser: "
                "user_6_last_nameuser_6>, "
                "<LinkLinkUser: user_7_last_nameuser_7>, "
                "<LinkLinkUser: user_8_last_nameuser_8>, <LinkLinkUser: "
                "Smithuser_9>, <LinkLinkUser: user_10_last_nameuser_10>, "
                "<LinkLinkUser: user_11_last_nameuser_11>]"
            )
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # DB check to check new FriendRequest
        self.assertTrue(FriendRequest.objects.filter(id=11).exists())
        self.assertEqual(friend_request_new.senderId, user_12_linklinkuser)
        self.assertEqual(friend_request_new.getterId, john_linklinkuser)
        self.assertEqual(friend_request_new.status, "Pending")


    def test_put_friend_request_p_2_a_max_onechon_invariant_sender(self):
        target_url = "/api/friendRequest/11/"
        # Pending -> Accepted
        # john already has 10 onechons, trys to get one more
        # should cause max onechon invariant to fail
        # Create 7 more users
        user_6 = User.objects.create_user(
            username="user_6",
            password="user_6password",
            first_name="user_6",
            last_name="user_6_last_name"
        )
        user_7 = User.objects.create_user(
            username="user_7",
            password="user_7password",
            first_name="user_7",
            last_name="user_7_last_name"
        )
        user_8 = User.objects.create_user(
            username="user_8",
            password="user_8password",
            first_name="user_8",
            last_name="user_8_last_name"
        )
        user_9 = User.objects.create_user(
            username="user_9",
            password="user_9password",
            first_name="user_9",
            last_name="Smith"
        )
        user_10 = User.objects.create_user(
            username="user_10",
            password="user_10password",
            first_name="user_10",
            last_name="user_10_last_name"
        )
        user_11 = User.objects.create_user(
            username="user_11",
            password="user_11password",
            first_name="user_11",
            last_name="user_11_last_name"
        )
        user_12 = User.objects.create_user(
            username="user_12",
            password="user_12password",
            first_name="user_12",
            last_name="user_12_last_name"
        )
        user_6_linklinkuser = LinkLinkUser.objects.create(
            user=user_6,
            emailValidated=False,
            email_unique="invalid_but_unique6@snu.ac.kr",
        )
        user_7_linklinkuser = LinkLinkUser.objects.create(
            user=user_7,
            emailValidated=False,
            email_unique="invalid_but_unique7@snu.ac.kr",
        )
        user_8_linklinkuser = LinkLinkUser.objects.create(
            user=user_8,
            emailValidated=False,
            email_unique="invalid_but_unique8@snu.ac.kr",
        )
        user_9_linklinkuser = LinkLinkUser.objects.create(
            user=user_9,
            emailValidated=False,
            email_unique="invalid_but_unique9@snu.ac.kr",
        )
        user_10_linklinkuser = LinkLinkUser.objects.create(
            user=user_10,
            emailValidated=False,
            email_unique="invalid_but_unique10@snu.ac.kr",
        )
        user_11_linklinkuser = LinkLinkUser.objects.create(
            user=user_11,
            emailValidated=False,
            email_unique="invalid_but_unique11@snu.ac.kr",
        )
        user_12_linklinkuser = LinkLinkUser.objects.create(
            user=user_12,
            emailValidated=False,
            email_unique="invalid_but_unique12@snu.ac.kr",
        )
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
        will_linklinkuser = LinkLinkUser.objects.get(pk=4)
        chris_linklinkuser = LinkLinkUser.objects.get(pk=5)
        # Init 10 onechon connections for john
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=emily_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=will_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=chris_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=user_6_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=user_7_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=user_8_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=user_9_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=user_10_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=user_11_linklinkuser,
            status="Accepted",
        )
        # Init one Pending request
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=user_12_linklinkuser,
            status="Pending",
        )
        # Login user_12
        response = self.client.login(
            username="user_12",
            password="user_12password"
        )
        # PUT
        response = self.client.put(
            target_url,
            {
                "status": "Accepted"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        friend_request_new = FriendRequest.objects.get(pk=11)
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message": (
                "Onechon Invariant Failed for CenaJohn. "
                "Onechon list length: 10 "
                "Onechon list of CenaJohn:"
                "[<LinkLinkUser: GunnJames>, "
                "<LinkLinkUser: BluntEmily>, <LinkLinkUser: SmithWill>, "
                "<LinkLinkUser: RockChris>, <LinkLinkUser: "
                "user_6_last_nameuser_6>, "
                "<LinkLinkUser: user_7_last_nameuser_7>, "
                "<LinkLinkUser: user_8_last_nameuser_8>, <LinkLinkUser: "
                "Smithuser_9>, <LinkLinkUser: user_10_last_nameuser_10>, "
                "<LinkLinkUser: user_11_last_nameuser_11>]"
            )
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # DB check to check new FriendRequest
        self.assertTrue(FriendRequest.objects.filter(id=11).exists())
        self.assertEqual(friend_request_new.senderId, john_linklinkuser)
        self.assertEqual(friend_request_new.getterId, user_12_linklinkuser)
        self.assertEqual(friend_request_new.status, "Pending")

#--------------------------------------------------------------------------
#   400 Checking Tests
#--------------------------------------------------------------------------

    def test_400_post_new_friend_request(self):
        target_url = "/api/friendRequest/"
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # POST
        response = self.client.post(
            target_url,
            {
                # "getterId": "3" # no getterId
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)


    def test_400_put_friend_request(self):
        target_url = "/api/friendRequest/1/"
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                # "status": "Accepted" # No status
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)
