"""
dummy test
"""

from django.test import TestCase
from ..routing import websocket_urlpatterns

class RoutingTestCase(TestCase):
    def test(self):
        tmp = ""
        tmp += websocket_urlpatterns
