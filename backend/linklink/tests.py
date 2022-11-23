"""
test module for linklink app
"""

from datetime import datetime, timedelta
import inspect
import json
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.core import mail
from django.test import TestCase, Client
from django.utils import timezone

from .models import (
    LinkLinkUser,
    FriendRequest,
    Verification,
    SkillTag,
    QualityTag,
    Profile,
    Education,
    JobExperience,
)


class LinkLinkTestCase(TestCase):
    """
    TestCase to test various LinkLink REST APIs
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
#   Auth Related Tests
#--------------------------------------------------------------------------

    def test_signup_success(self):
        target_url = "/api/auth/signup/"
        # Save initial object count
        user_count = User.objects.count()
        linklinkuser_count = LinkLinkUser.objects.count()
        verification_count = Verification.objects.count()
        profile_count = Profile.objects.count()
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "jim",
                "password": "jimpassword",
                "email": "newuniqueinvalidemail@snu.ac.kr",
                "firstname": "jim",
                "lastname": "carry"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 201)
        # Check Create User, LinkLinkUser, Verification, Profile
        self.assertTrue(User.objects.filter(id=user_count+1
            ).exists())
        self.assertTrue(LinkLinkUser.objects.filter(id=linklinkuser_count+1
            ).exists())
        self.assertTrue(Verification.objects.filter(id=verification_count+1
            ).exists())
        self.assertTrue(Profile.objects.filter(id=profile_count+1
            ).exists())
        new_user = User.objects.get(id=user_count+1)
        new_linklinkuser = LinkLinkUser.objects.get(id=linklinkuser_count+1)
        new_verification = Verification.objects.get(id=verification_count+1)
        new_profile = Profile.objects.get(id=profile_count+1)
        self.assertNotEqual(new_user.username, "")
        # Check valid email form regex
        self.assertRegex(
            new_linklinkuser.email_unique,
            r"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
        )
        # Check new user emailValidated=False
        self.assertFalse(new_linklinkuser.emailValidated)
        self.assertEqual(new_verification.purpose, "Register")
        # Check expiresAt be in the future
        self.assertLess(
            datetime.now().astimezone(timezone.get_default_timezone()),
            new_verification.expiresAt
        )
        # Check new profile is correctly made
        self.assertEqual(new_profile.introduction, "안녕하세요, carryjim입니다.")
        # Check email sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(
            mail.outbox[0].subject,
            "이메일 인증"
        )


    def test_signin_success(self):
        target_url = "/api/auth/signin/"
        # Set emailValidated = True
        johnlinklinkuser = LinkLinkUser.objects.get(id=1)
        johnlinklinkuser.emailValidated = True
        johnlinklinkuser.save()
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "john",
                "password": "johnpassword",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 200)
        # Check response
        expected_response_dict = {
            "id": 1,
            "email": "notiona@snu.ac.kr",
            "username": "john",
            "firstname": "John",
            "lastname": "Cena",
        }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            expected_response_dict
        )


    def test_signin_incorrect_info(self):
        target_url = "/api/auth/signin/"
        # Set emailValidated = True
        johnlinklinkuser = LinkLinkUser.objects.get(id=1)
        johnlinklinkuser.emailValidated = True
        johnlinklinkuser.save()
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "john",
                "password": "johnpasswordwrong", # wrong password
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        # Check response
        self.assertEqual(response.status_code, 401)
        error_message_dict = {"message": "incorrect username or password."}
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )


    def test_signin_havent_checked_email(self):
        target_url = "/api/auth/signin/"
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "john",
                "password": "johnpassword",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        # Check response
        self.assertEqual(response.status_code, 401)
        error_message_dict = {
            "message": ("Account john exists, but is not validated. "
                "A validation email has been "
                "resent to notiona@snu.ac.kr.")
            }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # Check email sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(
            mail.outbox[0].subject,
            "이메일 인증"
        )


    def test_signin_token_expired(self):
        target_url = "/api/auth/signin/"
        # Deliberately expire Verification.expiresAt
        john_verification = Verification.objects.get(id=1)
        past_time = \
            datetime.now() - timedelta(days=1)
        past_time= past_time.astimezone(timezone.get_default_timezone())
        john_verification.expiresAt = past_time
        john_verification.save()
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "john",
                "password": "johnpassword",
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        # Check response
        self.assertEqual(response.status_code, 401)
        error_message_dict = {
            "message": ("Account john exists, but is not validated. "
                "A validation email has been "
                "resent to notiona@snu.ac.kr.")
            }
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )
        # Check email sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(
            mail.outbox[0].subject,
            "이메일 인증"
        )
        # Check verification.expiresAt is updated into the future
        john_verification = Verification.objects.get(id=1)
        self.assertLess(
            datetime.now().astimezone(timezone.get_default_timezone()),
            john_verification.expiresAt
        )


    def test_signout_success(self):
        target_url = "/api/auth/signout/"
        # Login John
        response = self.client.login(username="john", password="johnpassword")
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 204)


    def test_verify_success(self):
        john_verification = Verification.objects.get(id=1)
        john_token = str(john_verification.token)
        target_url = f"/api/auth/verify/{john_token}/"
        # GET
        response = self.client.get(target_url)
        # Check response
        self.assertEqual(response.status_code, 200)
        success_message_dict = {"message":"Successfully verified"}
        self.assertDictEqual(
            json.loads(response.content.decode()),
            success_message_dict
        )
        # Check emailValidated=True
        john_linklinkuser = LinkLinkUser.objects.get(id=1)
        self.assertTrue(john_linklinkuser.emailValidated)


    def test_verify_expired(self):
        # Deliberately expire Verification.expiresAt
        john_verification = Verification.objects.get(id=1)
        past_time = \
            datetime.now() - timedelta(days=1)
        past_time= past_time.astimezone(timezone.get_default_timezone())
        john_verification.expiresAt = past_time
        john_verification.save()
        john_token = str(john_verification.token)
        target_url = f"/api/auth/verify/{john_token}/"
        # GET
        response = self.client.get(target_url)
        # Check response
        self.assertEqual(response.status_code, 401)
        error_message_dict = {"message":"Token Expired"}
        self.assertDictEqual(
            json.loads(response.content.decode()),
            error_message_dict
        )

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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
            inspect.stack()[0][3] + ".json" # current method name
        )
        with open(answer_json_path, "r", encoding="utf") as json_file:
            expected_json = json.load(json_file)
        self.assertEqual( # Expected response assert
            json.loads(response.content.decode()),
            expected_json
        )

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
            "test_answers",
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
        john_profile = Profile.objects.create(
            linklinkuser=john_linklinkuser,
            introduction="This is john",
            website="johnwebsite.com",
            imgUrl="https://catimage.com",
        )
        john_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))
        john_profile.skillTags.add(SkillTag.objects.get(name="Backend"))
        john_profile.qualityTags.add(QualityTag.objects.get(name="Sincere"))
        john_profile.qualityTags.add(QualityTag.objects.get(name="Loyal"))
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
            "test_answers",
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
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
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
        james_profile.qualityTags.add(QualityTag.objects.get(name="Sincere"))
        james_profile.qualityTags.add(QualityTag.objects.get(name="Loyal"))
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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
            "test_answers",
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


    def test_csrf_token(self):
        client = Client()
        target_url = "/api/csrf_token/"
        # POST
        response = client.post(target_url, {})
        # PUTT
        response = client.put(target_url, {})
        # DELETE
        response = client.delete(target_url)
        self.assertEqual(response.status_code, 405)  # Method not allowed

#--------------------------------------------------------------------------
#   401 Checking Tests
#--------------------------------------------------------------------------

    def test_401_signout(self):
        target_url = "/api/auth/signout/"
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 401)  # Unauthorized


    def test_401_friend(self):
        target_url = "/api/user/friend/"
        # GET
        response = self.client.get(target_url)
        self.assertEqual(response.status_code, 401)  # Unauthorized

#--------------------------------------------------------------------------
#   400 Checking Tests
#--------------------------------------------------------------------------

    def test_400_signup(self):
        target_url = "/api/auth/signup/"
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "jim",
                "password": "jimpassword",
                #"email": "notiona@snu.ac.kr", # no email
                "firstname": "jim",
                "lastname": "carry"
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)


    def test_400_signin(self):
        target_url = "/api/auth/signin/"
        # POST
        response = self.client.post(
            target_url,
            {
                "username": "john",
                #"password": "johnpassword", # no password
            },
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrftoken
        )
        self.assertEqual(response.status_code, 400)


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

#--------------------------------------------------------------------------
#   Misc Tests
#--------------------------------------------------------------------------

    def test_model_str(self):
        linklinkuser = LinkLinkUser.objects.get(id=1)
        another_linklinkuser = LinkLinkUser.objects.get(id=2)
        verification = Verification.objects.get(id=1)
        self.assertEqual(str(linklinkuser), "CenaJohn")
        self.assertIn("john", str(verification))
        self.assertIn("Register", str(verification))
        friend_request = FriendRequest.objects.create(
            senderId=linklinkuser,
            getterId=another_linklinkuser,
            status="Accepted",
        )
        self.assertEqual(
            str(friend_request),
            "CenaJohn->GunnJames, status:Accepted"
        )
        skill_tag = SkillTag.objects.create(
            name="Frontend"
        )
        self.assertEqual(str(skill_tag), "Frontend")
        quality_tag = QualityTag.objects.create(
            name="Helpful"
        )
        self.assertEqual(str(quality_tag), "Helpful")
        profile = Profile.objects.create(
            linklinkuser=linklinkuser,
            introduction="Hi",
            website="cutecat.com",
        )
        self.assertEqual(str(profile), "CenaJohn's profile")
        education = Education.objects.create(
            profile=profile,
            school="SNU",
            major="CLS",
            dateStart="2018-03-03",
            dateEnd="2022-02-28",
        )
        self.assertEqual(str(education), "SNU-CLS")
        job_experience = JobExperience.objects.create(
            profile=profile,
            company="SWPP Lab",
            position="Intern",
            dateStart="2018-03-03",
            dateEnd="2022-02-28",
        )
        self.assertEqual(str(job_experience), "SWPP Lab-Intern")
