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
