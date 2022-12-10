"""
Forgot related test module for linklink app
"""

from datetime import datetime, timedelta
import json
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.core import mail
from django.test import TestCase, Client
from django.utils import timezone

from ..models import (
    LinkLinkUser,
    Verification,
    SkillTag,
    QualityTag,
)


class LinkLinkForgotTestCase(TestCase):
    """
    Forgot related TestCase to test various LinkLink REST APIs
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
#   Forgot Related Tests
#--------------------------------------------------------------------------

    def test_get_forgot_username_success(self):
        target_url = "/api/forgot/username/notiona@snu.ac.kr/"
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200)
        # Check response
        expected_response_dict = {
            "username": "john"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            expected_response_dict
        )


    def test_404_get_forgot_username(self):
        target_url = "/api/forgot/username/doesnotexist@snu.ac.kr/"
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 404)
        # Check response
        error_message_dict = {
            "message": "user not found for given email doesnotexist@snu.ac.kr"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_post_forgot_password_new_verification_success(self):
        target_url = "/api/forgot/password/"
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "john",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # Check verification.expiresAt is updated into the future
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        self.assertTrue(
            Verification.objects.filter(
                linklinkuser=john_linklinkuser,
                purpose="Password"
            ).exists()
        )
        self.assertEqual(
            Verification.objects.filter(
                linklinkuser=john_linklinkuser,
                purpose="Password"
            ).count(),
            1
        )
        john_verification = Verification.objects.filter(
            linklinkuser=john_linklinkuser,
            purpose="Password"
        ).latest("expiresAt")
        self.assertLess(
            datetime.now().astimezone(timezone.get_default_timezone()),
            john_verification.expiresAt
        )
        # Check email sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(
            mail.outbox[0].subject,
            "비밀번호 재설정"
        )


    def test_post_forgot_password_exist_expired_verification_success(self):
        target_url = "/api/forgot/password/"
        # expired Verification for password already exists
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        expired_time = datetime.now() - timedelta(days=5)
        Verification.objects.create(
            linklinkuser=john_linklinkuser,
            purpose="Password",
            expiresAt=expired_time.astimezone(timezone.get_default_timezone())
        )
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "john",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # Check verification.expiresAt is updated into the future
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        self.assertTrue(
            Verification.objects.filter(
                linklinkuser=john_linklinkuser,
                purpose="Password"
            ).exists()
        )
        self.assertEqual(
            Verification.objects.filter(
                linklinkuser=john_linklinkuser,
                purpose="Password"
            ).count(),
            2
        )
        john_verification = Verification.objects.filter(
            linklinkuser=john_linklinkuser,
            purpose="Password"
        ).latest("expiresAt")
        expired_verification = Verification.objects.filter(
            linklinkuser=john_linklinkuser,
            purpose="Password"
        ).latest("-expiresAt")
        self.assertLess(
            datetime.now().astimezone(timezone.get_default_timezone()),
            john_verification.expiresAt
        )
        self.assertGreater(
            datetime.now().astimezone(timezone.get_default_timezone()),
            expired_verification.expiresAt
        )
        # Check email sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(
            mail.outbox[0].subject,
            "비밀번호 재설정"
        )


    def test_post_forgot_password_exist_unexpired_verification_success(self):
        target_url = "/api/forgot/password/"
        # unexpired Verification for password already exists
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        expired_time = datetime.now() + timedelta(hours=1)
        Verification.objects.create(
            linklinkuser=john_linklinkuser,
            purpose="Password",
            expiresAt=expired_time.astimezone(timezone.get_default_timezone())
        )
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "john",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # Check verification.expiresAt is updated into the future
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        self.assertTrue(
            Verification.objects.filter(
                linklinkuser=john_linklinkuser,
                purpose="Password"
            ).exists()
        )
        self.assertEqual(
            Verification.objects.filter(
                linklinkuser=john_linklinkuser,
                purpose="Password"
            ).count(),
            2
        )
        john_verification = Verification.objects.filter(
            linklinkuser=john_linklinkuser,
            purpose="Password"
        ).latest("expiresAt")
        unexpired_verification = Verification.objects.filter(
            linklinkuser=john_linklinkuser,
            purpose="Password"
        ).latest("-expiresAt")
        self.assertLess(
            datetime.now().astimezone(timezone.get_default_timezone()),
            john_verification.expiresAt
        )
        self.assertLess(
            datetime.now().astimezone(timezone.get_default_timezone()),
            unexpired_verification.expiresAt
        )
        # Check email sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(
            mail.outbox[0].subject,
            "비밀번호 재설정"
        )


    def test_400_post_forgot_password(self):
        target_url = "/api/forgot/password/"
        # POST
        response = self.client.post(
            target_url,
            {
                # "username": "john", # no username
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)


    def test_404_post_forgot_password(self):
        target_url = "/api/forgot/password/"
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "charles",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 404)
        # Check response
        error_message_dict = {
            "message": "user not found for given username charles"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_put_forgot_password_success(self):
        target_url = "/api/forgot/password/"
        # Create unexpired password token for john
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        unexpired_verification = Verification.objects.create(
            linklinkuser=john_linklinkuser,
            purpose="Password",
            expiresAt=(datetime.now()+timedelta(days=1)).astimezone(
                timezone.get_default_timezone()
            )
        )
        unexpired_token = unexpired_verification.token
        # PUT
        response = self.client.put(
            target_url,
            {
                "token": unexpired_token,
                "newPassword": "johnpasswordnew",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # Check password change
        self.assertFalse(
            self.client.login(username="john", password="johnpassword")
        )
        self.assertTrue(
            self.client.login(username="john", password="johnpasswordnew")
        )


    def test_401_put_forgot_password_expired_token(self):
        target_url = "/api/forgot/password/"
        # Create expired password token for john
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        expired_verification = Verification.objects.create(
            linklinkuser=john_linklinkuser,
            purpose="Password",
            expiresAt=(datetime.now()-timedelta(days=1)).astimezone(
                timezone.get_default_timezone()
            )
        )
        expired_token = expired_verification.token
        # PUT
        response = self.client.put(
            target_url,
            {
                "token": expired_token,
                "newPassword": "johnpasswordnew",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 401)
        error_message_dict = {
            "message": "Token Expired"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_404_put_forgot_password(self):
        target_url = "/api/forgot/password/"
        # PUT
        response = self.client.put(
            target_url,
            {
                "token": "nonexistant_token",
                "newPassword": "johnpasswordnew",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 404)
        error_message_dict = {
            "message": "user not found for given token nonexistant_token"
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_400_put_forgot_password(self):
        target_url = "/api/forgot/password/"
        # PUT
        response = self.client.put(
            target_url,
            {
                #"token": "nonexistant_token", # no token
                "newPassword": "johnpasswordnew",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)
