"""
Profile related test module for linklink app
"""

from datetime import datetime, timedelta
import inspect
import json
import os
from unittest.mock import patch

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
    Education,
    JobExperience,
    QualityTagRequest,
)


class LinkLinkProfileTestCase(TestCase):
    """
    Profile related TestCase to test various LinkLink REST APIs
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
#   Profile Related Tests
#--------------------------------------------------------------------------

    def test_put_my_profile_success(self):
        target_url = "/api/profile/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Create Profile
        john_linklinkuser = LinkLinkUser.objects.get(id=1)
        john_profile = Profile.objects.create(
            linklinkuser=john_linklinkuser,
            introduction="This is john",
            website="johnwebsite.com",
            imgUrl="https://catimage.com",
        )
        john_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))
        john_profile.skillTags.add(SkillTag.objects.get(name="Backend"))
        Education.objects.create(
            profile=john_profile,
            school="SNU",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=john_profile,
            school="MIT",
            major="CSE",
            dateStart="2013-03-12",
            dateEnd="2019-04-12",
        )
        JobExperience.objects.create(
            profile=john_profile,
            company="Google",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
        )
        # PUT
        response = self.client.put(
            target_url,
            {
                "introduction": "This is john modified",
                "skillTags": [
                    {"name": "Frontend"}
                ],
                "educations": [
                    {
                        "school": "SNU2",
                        "major": "CSE2",
                        "dateStart": "2017-03-01",
                        "dateEnd": "2023-02-28"
                    }
                ],
                "jobExperiences": [
                    {
                        "company": "Google2",
                        "position": "CEO2",
                        "dateStart": "2019-06-01",
                        "dateEnd": "2020-06-01"
                    }
                ],
                "website": "modified@pr.com",
                "imgUrl": "modifiedimage.com"
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
        self.assertDictEqual( # Expected response assert
            json.loads(response.content.decode()),
            expected_json
        )


    def test_put_my_profile_skill_tag_not_found(self):
        target_url = "/api/profile/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Create Profile
        john_linklinkuser = LinkLinkUser.objects.get(id=1)
        john_profile = Profile.objects.create(
            linklinkuser=john_linklinkuser,
            introduction="This is john",
            website="johnwebsite.com",
            imgUrl="https://catimage.com",
        )
        john_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))
        john_profile.skillTags.add(SkillTag.objects.get(name="Backend"))
        Education.objects.create(
            profile=john_profile,
            school="SNU",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=john_profile,
            school="MIT",
            major="CSE",
            dateStart="2013-03-12",
            dateEnd="2019-04-12",
        )
        JobExperience.objects.create(
            profile=john_profile,
            company="Google",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
        )
        # PUT
        response = self.client.put(
            target_url,
            {
                "introduction": "This is john modified",
                "skillTags": [
                    {"name": "Frontend"},
                    {"name": "Backend"},
                    {"name": "NONEXISTANT SKILL"} # nonexistant skill
                ],
                "educations": [
                    {
                        "school": "SNU2",
                        "major": "CSE2",
                        "dateStart": "2018-03-12",
                        "dateEnd": "2022-04-12"
                    }
                ],
                "jobExperiences": [
                    {
                        "company": "Google2",
                        "position": "CEO2",
                        "dateStart": "2018-02-12",
                        "dateEnd": "2022-09-12"
                    }
                ],
                "website": "modified@pr.com",
                "imgUrl": "modifiedimage.com"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 404)
        error_message_dict = {
            "message":
            "SkillTag NONEXISTANT SKILL not found."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_get_my_profile_success(self):
        target_url = "/api/profile/1/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Create Profile
        john_linklinkuser = LinkLinkUser.objects.get(id=1)
        james_linklinkuser = LinkLinkUser.objects.get(id=2)
        john_profile = Profile.objects.create(
            linklinkuser=john_linklinkuser,
            introduction="This is john",
            website="johnwebsite.com",
            imgUrl="https://catimage.com",
        )
        john_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))
        john_profile.skillTags.add(SkillTag.objects.get(name="Backend"))
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
        Education.objects.create(
            profile=john_profile,
            school="SNU",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=john_profile,
            school="MIT",
            major="CSE",
            dateStart="2013-03-12",
            dateEnd="2019-04-12",
        )
        JobExperience.objects.create(
            profile=john_profile,
            company="Google",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
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
        self.assertDictEqual( # Expected response assert
            json.loads(response.content.decode()),
            expected_json
        )


    def test_get_other_profile_success(self):
        target_url = "/api/profile/2/"
        # Initialize Connection
        john_linklinkuser = LinkLinkUser.objects.get(pk=1)
        james_linklinkuser = LinkLinkUser.objects.get(pk=2)
        emily_linklinkuser = LinkLinkUser.objects.get(pk=3)
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
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Create Profile of James
        james_profile = Profile.objects.create(
            linklinkuser=james_linklinkuser,
            introduction="This is james",
            website="jameswebsite.com",
            imgUrl="https://catimage.com",
        )
        james_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))
        james_profile.skillTags.add(SkillTag.objects.get(name="Backend"))
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
        QualityTagRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="정직한",
        )
        QualityTagRequest.objects.create(
            senderId=emily_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="논리적인",
        )
        Education.objects.create(
            profile=james_profile,
            school="SNU",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=james_profile,
            school="MIT",
            major="CSE",
            dateStart="2013-03-12",
            dateEnd="2019-04-12",
        )
        JobExperience.objects.create(
            profile=james_profile,
            company="Google",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
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
        self.assertDictEqual( # Expected response assert
            json.loads(response.content.decode()),
            expected_json
        )


    def test_get_profile_linklinkuser_not_found(self):
        target_url = "/api/profile/1000/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 404)
        error_message_dict = {
            "message":
            "userId=1000 not found."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_get_profile_read_permission_forbidden(self):
        target_url = "/api/profile/2/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 403)
        error_message_dict = {
            "message":
            "No read permission for userId=2."
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_post_upload_profile_image_success(self):
        target_url = "/api/profile/uploadImage/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # POST
        default_user_image_path = os.path.join(
            self.linklink_path,
            "../test_answers",
            "default_user_image.png"
        )
        test_response_dict = {
            "secure_url" : "https://testimageurl.com"
        }
        with patch(
            "cloudinary.uploader.upload",
            return_value=test_response_dict
            ):
            with open(default_user_image_path, "rb") as image:
                response = self.client.post(
                    target_url,
                    {
                        "profileImage": image
                    },
                    HTTP_X_CSRFTOKEN=self.csrftoken
                )
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        cloudinary_url = response_dict["imgUrl"]
        self.assertEqual(cloudinary_url, "https://testimageurl.com")

#--------------------------------------------------------------------------
#   400 Checking Tests
#--------------------------------------------------------------------------

    def test_400_put_profile(self):
        target_url = "/api/profile/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # Create Profile
        john_linklinkuser = LinkLinkUser.objects.get(id=1)
        john_profile = Profile.objects.create(
            linklinkuser=john_linklinkuser,
            introduction="This is john",
            website="johnwebsite.com",
            imgUrl="https://catimage.com",
        )
        john_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))
        john_profile.skillTags.add(SkillTag.objects.get(name="Backend"))
        Education.objects.create(
            profile=john_profile,
            school="SNU",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=john_profile,
            school="MIT",
            major="CSE",
            dateStart="2013-03-12",
            dateEnd="2019-04-12",
        )
        JobExperience.objects.create(
            profile=john_profile,
            company="Google",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
        )
        # PUT
        response = self.client.put(
            target_url,
            {
                "introduction": "This is john modified",
                "skillTags": [
                    {"name": "Frontend"}
                ],
                "educations": [
                    {
                        "school": "SNU2",
                        "major": "CSE2",
                        "dateStart": "2018-03-12",
                        "dateEnd": "2022-04-12"
                    }
                ],
                "jobExperiences": [
                    {
                        "company": "Google2",
                        "position": "CEO2",
                        "dateStart": "2018-02-12",
                        "dateEnd": "2022-09-12"
                    }
                ],
                "website": "modified@pr.com",
                # "imgUrl": "modifiedimage.com" # no imgUrl
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)


    def test_400_post_upload_profile_image(self):
        target_url = "/api/profile/uploadImage/"
        # Login John
        self.client.login(username="john", password="johnpassword")
        # POST
        default_user_image_path = os.path.join(
            self.linklink_path,
            "../test_answers",
            "default_user_image.png"
        )
        test_response_dict = {
            "secure_url" : "https://testimageurl.com"
        }
        with patch(
            "cloudinary.uploader.upload",
            return_value=test_response_dict
            ):
            with open(default_user_image_path, "rb"):# as image:
                response = self.client.post(
                    target_url,
                    {
                        # "profileImage": image # no profileImage
                    },
                    HTTP_X_CSRFTOKEN=self.csrftoken
                )
        self.assertEqual(response.status_code, 400)
