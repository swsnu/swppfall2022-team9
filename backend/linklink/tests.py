"""
test module for linklink app
"""

import json
import os

from django.test import TestCase, Client
from django.contrib.auth.models import User

from .models import LinkLinkUser, FriendRequest


class LinkLinkTestCase(TestCase):
    """
    TestCase to test various LinkLink REST APIs
    """
    def setUp(self):
        # Create 5 Users
        john = User.objects.create_user(
            username="john",
            password="johnpassword",
            email="notiona@snu.ac.kr",
            first_name="John",
            last_name="Cena"
        )
        james = User.objects.create_user(
            username="james",
            password="jamespassword",
            email="notiona@snu.ac.kr",
            first_name="James",
            last_name="Gunn"
        )
        emily = User.objects.create_user(
            username="emily",
            password="emilypassword",
            email="notiona@snu.ac.kr",
            first_name="Emily",
            last_name="Blunt"
        )
        will = User.objects.create_user(
            username="will",
            password="willpassword",
            email="notiona@snu.ac.kr",
            first_name="Will",
            last_name="Smith"
        )
        chris = User.objects.create_user(
            username="chris",
            password="chrispassword",
            email="notiona@snu.ac.kr",
            first_name="Chris",
            last_name="Rock"
        )
        LinkLinkUser.objects.create(
            user=john,
            imgUrl = "https://catimage.com"
        )
        LinkLinkUser.objects.create(
            user=james,
            imgUrl = "https://catimage.com"
        )
        LinkLinkUser.objects.create(
            user=emily,
            imgUrl = "https://catimage.com"
        )
        LinkLinkUser.objects.create(
            user=will,
            imgUrl = "https://catimage.com"
        )
        LinkLinkUser.objects.create(
            user=chris,
            imgUrl = "https://catimage.com"
        )


#--------------------------------------------------------------------------
#   /api/user/onechon Tests
#--------------------------------------------------------------------------
    def test_success_onechon_general(self):
        client = Client(enforce_csrf_checks=True)
        target_url = "/api/user/onechon/"
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
        # Login John
        response = client.login(username="john", password="johnpassword")
        # GET
        response = client.get(target_url)
        self.assertEqual(response.status_code, 200) # Successful GET
        linklink_path = os.path.dirname(os.path.realpath(__file__))
        answer_json_path = os.path.join(
            linklink_path,
            "test_answers",
            "test_success_onechon_general.json"
        )
        with open(answer_json_path, "r", encoding="utf") as json_file:
            expected_json = json.load(json_file)
        self.assertEqual( # Expected response assert
            json.loads(response.content.decode()),
            expected_json
        )


#--------------------------------------------------------------------------
#   405 Checking Tests
#--------------------------------------------------------------------------
    def test_405_onechon(self):
        client = Client(enforce_csrf_checks=True)
        target_url = "/api/user/onechon/"
        # Get csrf token from cookie
        csrftoken = client.get("/api/token/").cookies["csrftoken"].value
        # PUT
        response = client.put(
            target_url,
            {},
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 405)  # Method not allowed
        # Other Random Request Method
        client.patch(
            target_url,
            {},
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 405)  # Method not allowed


#--------------------------------------------------------------------------
#   401 Checking Tests
#--------------------------------------------------------------------------
    def test_401_onechon(self):
        client = Client(enforce_csrf_checks=True)
        target_url = "/api/user/onechon/"
        # GET
        response = client.get(target_url)
        self.assertEqual(response.status_code, 401)  # Unauthorized
