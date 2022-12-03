"""
SkillTag, QualityTag test module for linklink app
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
    SkillTag,
    QualityTag,
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
#   SkillTag, QualityTag related Related Tests
#--------------------------------------------------------------------------

    def test_get_skill_tags_success(self):
        target_url = "/api/skillTags/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        all_skill_tags = response_dict["skillTags"]
        self.assertEqual(all_skill_tags, ["Frontend", "Backend", "DevOps"])


    def test_get_quality_tags_success(self):
        target_url = "/api/qualityTags/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        all_quality_tags = response_dict["qualityTags"]
        self.assertEqual(all_quality_tags, ["Sincere", "Loyal", "Intelligent"])
