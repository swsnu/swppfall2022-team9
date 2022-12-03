from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("<chat_room_name>/", consumers.ChatConsumer.as_asgi()),  # user1_id < user2_id
]
