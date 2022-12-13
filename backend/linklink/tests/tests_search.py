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
    FriendRequest,
    Verification,
    SkillTag,
    QualityTag,
    Profile,
    Education,
    JobExperience,
    QualityTagRequest,
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
        will = User.objects.create_user(
            username="will",
            password="willpassword",
            # email="notiona@snu.ac.kr",
            first_name="Will",
            last_name="Smith",
        )
        chris = User.objects.create_user(
            username="chris",
            password="chrispassword",
            # email="notiona@snu.ac.kr",
            first_name="Chris",
            last_name="Rock",
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
        expire_time = datetime.now() + timedelta(days=settings.EMAIL_EXPIRE_DAYS)
        expire_time = expire_time.astimezone(timezone.get_default_timezone())
        Verification.objects.create(
            linklinkuser=john_linklinkuser, purpose="Register", expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=james_linklinkuser, purpose="Register", expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=emily_linklinkuser, purpose="Register", expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=will_linklinkuser, purpose="Register", expiresAt=expire_time
        )
        Verification.objects.create(
            linklinkuser=chris_linklinkuser, purpose="Register", expiresAt=expire_time
        )
        SkillTag.objects.create(name="Frontend")
        QualityTag.objects.create(name="성실한")
        QualityTag.objects.create(name="논리적인")

        # Initialize frequently used member variables
        self.client = Client(enforce_csrf_checks=True)
        self.csrftoken = self.client.get("/api/csrf_token/").cookies["csrftoken"].value
        self.linklink_path = os.path.dirname(os.path.realpath(__file__))

    def test_search_friends(self):
        target_url = "/api/searchFriends/"
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

        james_linklinkuser = LinkLinkUser.objects.get(id=2)
        james_profile = Profile.objects.create(
            linklinkuser=james_linklinkuser,
            introduction="This is James",
            website="jameswebsite.com",
            imgUrl="https://catimage.com",
        )
        james_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))

        emily_linklinkuser = LinkLinkUser.objects.get(id=3)
        emily_profile = Profile.objects.create(
            linklinkuser=emily_linklinkuser,
            introduction="This is Emily",
            website="emilywebsite.com",
            imgUrl="https://catimage.com",
        )
        emily_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))

        will_linklinkuser = LinkLinkUser.objects.get(id=4)
        will_profile = Profile.objects.create(
            linklinkuser=will_linklinkuser,
            introduction="This is James",
            website="jameswebsite.com",
            imgUrl="https://catimage.com",
        )
        will_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))

        chris_linklinkuser = LinkLinkUser.objects.get(id=5)
        chris_profile = Profile.objects.create(
            linklinkuser=chris_linklinkuser,
            introduction="This is James",
            website="jameswebsite.com",
            imgUrl="https://catimage.com",
        )
        chris_profile.skillTags.add(SkillTag.objects.get(name="Frontend"))

        Education.objects.create(
            profile=john_profile,
            school="Stanford",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=james_profile,
            school="Stanford",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=emily_profile,
            school="Stanford",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=chris_profile,
            school="Stanford",
            major="CSE",
            dateStart="2018-03-12",
            dateEnd="2022-04-12",
        )
        Education.objects.create(
            profile=will_profile,
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
        JobExperience.objects.create(
            profile=james_profile,
            company="Google",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
        )
        JobExperience.objects.create(
            profile=will_profile,
            company="Google",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
        )
        JobExperience.objects.create(
            profile=emily_profile,
            company="Facebook",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
        )
        JobExperience.objects.create(
            profile=chris_profile,
            company="Facebook",
            position="CEO",
            dateStart="2018-02-12",
            dateEnd="2022-09-12",
        )

        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=will_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=james_linklinkuser,
            getterId=emily_linklinkuser,
            status="Accepted",
        )
        FriendRequest.objects.create(
            senderId=will_linklinkuser,
            getterId=chris_linklinkuser,
            status="Accepted",
        )

        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=james_linklinkuser,
            status=True,
            name="논리적인",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=will_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=emily_linklinkuser,
            status=True,
            name="성실한",
        )
        QualityTagRequest.objects.create(
            senderId=john_linklinkuser,
            getterId=chris_linklinkuser,
            status=True,
            name="성실한",
        )

        response = self.client.get(target_url + "James/")
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "friendList": [
                {
                    "id": 2,
                    "firstname": "James",
                    "lastname": "Gunn",
                    "imgUrl": "https://catimage.com",
                    "isTwoChon": False,
                    "chons": [],
                    "isNotSearched": False,
                }
            ]
        }
        self.assertEqual(response_dict, response_answer)

        response = self.client.get(target_url + "프론트/")
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "friendList": [
                {
                    "id": 2,
                    "firstname": "James",
                    "lastname": "Gunn",
                    "imgUrl": "https://catimage.com",
                    "isTwoChon": False,
                    "chons": [
                        {
                            "id": 3,
                            "firstname": "Emily",
                            "lastname": "Blunt",
                            "imgUrl": "https://catimage.com",
                            "isTwoChon": True,
                            "chons": [],
                        }
                    ],
                    "isNotSearched": False,
                },
                {
                    "id": 4,
                    "firstname": "Will",
                    "lastname": "Smith",
                    "imgUrl": "https://catimage.com",
                    "isTwoChon": False,
                    "chons": [
                        {
                            "id": 5,
                            "firstname": "Chris",
                            "lastname": "Rock",
                            "imgUrl": "https://catimage.com",
                            "isTwoChon": True,
                            "chons": [],
                        }
                    ],
                    "isNotSearched": False,
                },
            ]
        }
        self.assertEqual(response_dict, response_answer)

        response = self.client.get(target_url + "strategies/")
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer ={'friendList': []}
        self.assertEqual(response_dict, response_answer)

        response = self.client.get(target_url + "논리적인/")
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "friendList": [
                {
                    "id": 2,
                    "firstname": "James",
                    "lastname": "Gunn",
                    "imgUrl": "https://catimage.com",
                    "isTwoChon": False,
                    "chons": [],
                    "isNotSearched": False,
                }
            ]
        }
        self.assertEqual(response_dict, response_answer)

        response = self.client.get(target_url + "StanFord/")
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "friendList": [
                {
                    "id": 2,
                    "firstname": "James",
                    "lastname": "Gunn",
                    "imgUrl": "https://catimage.com",
                    "isTwoChon": False,
                    "chons": [
                        {
                            "id": 3,
                            "firstname": "Emily",
                            "lastname": "Blunt",
                            "imgUrl": "https://catimage.com",
                            "isTwoChon": True,
                            "chons": [],
                        }
                    ],
                    "isNotSearched": False,
                },
                {
                    "id": 4,
                    "firstname": "Will",
                    "lastname": "Smith",
                    "imgUrl": "https://catimage.com",
                    "isTwoChon": False,
                    "chons": [
                        {
                            "id": 5,
                            "firstname": "Chris",
                            "lastname": "Rock",
                            "imgUrl": "https://catimage.com",
                            "isTwoChon": True,
                            "chons": [],
                        }
                    ],
                    "isNotSearched": True,
                },
            ]
        }
        self.assertEqual(response_dict, response_answer)

        response = self.client.get(target_url + "프론트/")
        self.assertEqual(response.status_code, 200)
        response_dict = json.loads(response.content.decode())
        response_answer = {
            "friendList": [
                {
                    "id": 2,
                    "firstname": "James",
                    "lastname": "Gunn",
                    "imgUrl": "https://catimage.com",
                    "isTwoChon": False,
                    "chons": [
                        {
                            "id": 3,
                            "firstname": "Emily",
                            "lastname": "Blunt",
                            "imgUrl": "https://catimage.com",
                            "isTwoChon": True,
                            "chons": [],
                        }
                    ],
                    "isNotSearched": False,
                },
                {
                    "id": 4,
                    "firstname": "Will",
                    "lastname": "Smith",
                    "imgUrl": "https://catimage.com",
                    "isTwoChon": False,
                    "chons": [
                        {
                            "id": 5,
                            "firstname": "Chris",
                            "lastname": "Rock",
                            "imgUrl": "https://catimage.com",
                            "isTwoChon": True,
                            "chons": [],
                        }
                    ],
                    "isNotSearched": False,
                },
            ]
        }
        self.assertEqual(response_dict, response_answer)
