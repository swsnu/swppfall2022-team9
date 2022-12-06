"""
SkillTag, QualityTag test module for linklink app
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
    Verification,
    FriendRequest,
    SkillTag,
    QualityTag,
    QualityTagRequest,
)


class LinkLinkTagsTestCase(TestCase):
    """
    SkillTag, QualityTag related TestCase to test various LinkLink REST APIs
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
            name="유쾌한"
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
#   SkillTag, QualityTag related Related Tests
#--------------------------------------------------------------------------

    def test_get_all_skill_tags_success(self):
        target_url = "/api/skillTags/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        all_skill_tags = response_dict["skillTags"]
        self.assertEqual(all_skill_tags, [
            {"name": "Frontend"},
            {"name": "Backend"},
            {"name": "DevOps"}
        ])


    def test_get_all_quality_tags_success(self):
        target_url = "/api/qualityTags/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        all_quality_tags = response_dict["qualityTags"]
        self.assertEqual(all_quality_tags, [
            {"name": "성실한"},
            {"name": "정직한"},
            {"name": "유쾌한"},
            {"name": "논리적인"}
        ])


    def test_get_quality_tag_success(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        # GET
        response = self.client.get(target_url)
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


    def test_404_get_quality_tag(self):
        target_url = "/api/qualityTags/1000/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 404)


    def test_not_onechon_get_quality_tag(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 403)


    def test_my_quality_tag_get_quality_tag(self):
        # not allowed to get my profile's QualityTags
        target_url = "/api/qualityTags/1/"
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        QualityTagRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status=True,
            name="정직한",
        )
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 403)


    def test_put_minus_quality_tag_success(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        # PUT
        request_body = {
            "qualityTags": [
                    {"name": "성실한"},
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
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
        # Check DB
        related_quality_tag_requests = QualityTagRequest.objects.filter(
            senderId=1,
            getterId=2,
            status=True,
        )
        self.assertEqual(len(related_quality_tag_requests), 1)
        existing_true_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="성실한",
        )
        self.assertTrue(existing_true_quality_tag_request.status)
        existing_false_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="정직한",
        )
        self.assertFalse(existing_false_quality_tag_request.status)


    def test_put_add_quality_tag_success(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        # PUT
        request_body = {
            "qualityTags": [
                {"name": "정직한"},
                {"name": "성실한"},
                {"name": "논리적인"},
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
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
        # Check DB
        related_quality_tag_requests = QualityTagRequest.objects.filter(
            senderId=1,
            getterId=2,
            status=True,
        )
        self.assertEqual(len(related_quality_tag_requests), 3)
        new_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="논리적인",
        )
        self.assertTrue(new_quality_tag_request.status)
        existing_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="성실한",
        )
        self.assertTrue(existing_quality_tag_request.status)


    def test_put_both_quality_tag_success(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        # PUT
        request_body = {
            "qualityTags": [
                    {"name": "정직한"},
                    {"name": "논리적인"},
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
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
        # Check DB
        related_quality_tag_requests = QualityTagRequest.objects.filter(
            senderId=1,
            getterId=2,
            status=True,
        )
        self.assertEqual(len(related_quality_tag_requests), 2)
        new_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="논리적인",
        )
        self.assertTrue(new_quality_tag_request.status)
        existing_true_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="정직한",
        )
        self.assertTrue(existing_true_quality_tag_request.status)
        existing_false_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="성실한",
        )
        self.assertFalse(existing_false_quality_tag_request.status)


    def test_put_clear_quality_tag_success(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        # PUT
        request_body = {
            "qualityTags": [
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
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
        # Check DB
        related_quality_tag_requests = QualityTagRequest.objects.filter(
            senderId=1,
            getterId=2,
            status=True,
        )
        self.assertEqual(len(related_quality_tag_requests), 0)
        existing_false_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="성실한",
        )
        self.assertFalse(existing_false_quality_tag_request.status)


    def test_put_new_quality_tag_success(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        # PUT
        request_body = {
            "qualityTags": [
                {"name": "정직한"},
                {"name": "성실한"},
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
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
        # Check DB
        related_quality_tag_requests = QualityTagRequest.objects.filter(
            senderId=1,
            getterId=2,
            status=True,
        )
        self.assertEqual(len(related_quality_tag_requests), 2)
        existing_true_quality_tag_request = QualityTagRequest.objects.get(
            senderId=1,
            getterId=2,
            name="성실한",
        )
        self.assertTrue(existing_true_quality_tag_request.status)


    def test_put_invalid_quality_tag(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        # PUT
        request_body = {
            "qualityTags": [
                {"name": "정직한"},
                {"name": "성실한"},
                {"name": "하이"} # invalid qualityTag
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)
        error_message_dict = {
            "message":
            "Request includes invalid qualityTag: 하이"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_404_put_quality_tag(self):
        target_url = "/api/qualityTags/1000/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        request_body = {
            "qualityTags": [
                {"name": "정직한"},
                {"name": "성실한"},
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 404)


    def test_not_onechon_put_quality_tag(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        request_body = {
            "qualityTags": [
                {"name": "정직한"},
                {"name": "성실한"},
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)


    def test_my_quality_tag_put_quality_tag(self):
        # not allowed to put my profile
        target_url = "/api/qualityTags/1/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        request_body = {
            "qualityTags": [
                {"name": "정직한"},
                {"name": "성실한"},
            ]
        }
        response = self.client.put(
            target_url,
            request_body,
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 403)


    def test_400_put_quality_tag(self):
        target_url = "/api/qualityTags/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Init QualityTagRequest
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=john_linklinkuser,
            status="Accepted",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        # PUT
        request_body = {
            # no qualityTags
        }
        response = self.client.put(
            target_url,
            request_body,
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)
