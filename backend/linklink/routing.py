"""
websocket url patterns
"""

from django.urls import path
from linklink import consumers

websocket_urlpatterns = [
    path(
        "ws/<chat_room_name>/",  # user1_id < user2_id
        consumers.ChatConsumer.as_asgi()
    )
]
