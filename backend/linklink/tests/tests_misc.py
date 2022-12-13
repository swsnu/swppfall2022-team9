from django.test import TestCase
from ..routing import websocket_urlpatterns

class RoutingTestCase(TestCase):
    def test(self):
        print(websocket_urlpatterns)
