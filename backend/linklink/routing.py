"""
websocket url patterns
"""

from django.urls import path
from linklink import consumers

websocket_urlpatterns = [
    path("ws/notification/<user_id>/", consumers.NotificationConsumer.as_asgi()),
    path(
        "ws/<chat_room_name>/", consumers.ChatConsumer.as_asgi()  # user1_id < user2_id
    ),
]
