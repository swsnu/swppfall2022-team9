"""
Account test module for linklink app
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
    SkillTag,
    QualityTag,
)


class LinkLinkAccountTestCase(TestCase):
    """
    Account related TestCase to test various LinkLink REST APIs
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
            emailValidated=True,
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
            name="?????????"
        )
        QualityTag.objects.create(
            name="?????????"
        )
        QualityTag.objects.create(
            name="????????????"
        )
        # Initialize frequently used member variables
        self.client = Client(enforce_csrf_checks=True)
        self.csrftoken = \
            self.client.get("/api/csrf_token/").cookies["csrftoken"].value
        self.linklink_path = os.path.dirname(os.path.realpath(__file__))

#--------------------------------------------------------------------------
#   Account Related Tests
#--------------------------------------------------------------------------

    def test_get_account_info_success(self):
        target_url = "/api/account/"
        # Login John
        self.client.login(username="john", password="johnpassword")
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


    def test_put_account_info_success(self):
        target_url = "/api/account/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "lastname": "Cenaa",
                "firstname": "Johnn",
                "email": "invalid_but_unique777@snu.ac.kr"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200) # Successful GET
        john_user = User.objects.get(pk=1)
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        self.assertEqual(john_user.last_name, "Cenaa")
        self.assertEqual(john_user.first_name, "Johnn")
        self.assertEqual(
            john_linklinkuser.email_unique,
            "invalid_but_unique777@snu.ac.kr"
        )
        # check DB to see emailValidated=False
        self.assertFalse(john_linklinkuser.emailValidated)


    def test_put_account_info_same_email_success(self):
        target_url = "/api/account/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "lastname": "Cenaa",
                "firstname": "Johnn",
                "email": "notiona@snu.ac.kr"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200) # Successful GET
        john_user = User.objects.get(pk=1)
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        self.assertEqual(john_user.last_name, "Cenaa")
        self.assertEqual(john_user.first_name, "Johnn")
        self.assertEqual(
            john_linklinkuser.email_unique,
            "notiona@snu.ac.kr"
        )
        # check DB to see emailValidated=True, as email has not changed
        self.assertTrue(john_linklinkuser.emailValidated)


    def test_400_put_account_info(self):
        target_url = "/api/account/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                # "lastname": "Cenaa", # no lastname
                "firstname": "Johnn",
                "email": "invalid_but_unique777@snu.ac.kr"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)


    def test_400_put_account_info_duplicate_email(self):
        target_url = "/api/account/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "lastname": "Cenaa",
                "firstname": "Johnn",
                "email": "invalid_but_unique1@snu.ac.kr" # duplicate
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)
        error_message_dict = {
            "message":
            "email invalid_but_unique1@snu.ac.kr already exists in DB"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_reset_password_success(self):
        target_url = "/api/account/password/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                "newPassword": "johnpasswordnew"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200) # Successful GET
        self.assertFalse(
            self.client.login(username="john", password="johnpassword")
        )
        self.assertTrue(
            self.client.login(username="john", password="johnpasswordnew")
        )


    def test_400_reset_password(self):
        target_url = "/api/account/password/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # PUT
        response = self.client.put(
            target_url,
            {
                # "newPassword": "johnpasswordnew" # no new password
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)
