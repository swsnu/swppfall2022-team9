"""
consumers to handle chat feature
"""

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from linklink.models import ChatRoom, Message, LinkLinkUser

class ChatConsumer(AsyncJsonWebsocketConsumer):
    """
    chat consumer
    """

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.chat_room_name = None
        self.chat_room = None

    async def connect(self):
        chat_room_name = self.scope["url_route"]["kwargs"]["chat_room_name"]
        self.chat_room_name = chat_room_name

        # Join room group
        await self.channel_layer.group_add(
            self.chat_room_name,
            self.channel_name
        )
        await self.accept()
        self.chat_room = await self.get_chatroom()

        # Send last 50 messages
        last_50_messages = await self.get_last_50_messages()
        await self.send_json(
            {
                "type": "last_50_messages",
                "messages": last_50_messages
            }
        )

    async def disconnect(self, code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.chat_room_name,
            self.channel_name
        )
        return super().disconnect(code)

    @database_sync_to_async
    def get_chatroom(self):
        user_ids = self.chat_room_name.split("__")
        chat_room = ChatRoom.objects.get_or_create(
            name=f"[{user_ids[0]}]__[{user_ids[1]}]"
        )[0]
        return chat_room

    @database_sync_to_async
    def get_last_50_messages(self):
        messages = self.chat_room.messages.all().order_by("timeStamp")[0:50]
        serialized = [
            {
                "senderId": message.sender.id,
                "content": message.content,
                "timeStamp": str(message.timeStamp),
            }
            for message in messages
        ]
        return serialized

    @database_sync_to_async
    def create_message(self, sender_id, receiver_id, content):
        return Message.objects.create(
            chatRoom=self.chat_room,
            sender=LinkLinkUser.objects.get(id=sender_id),
            receiver=LinkLinkUser.objects.get(id=receiver_id),
            content=content,
        )

    # Receive message from WebSocket
    async def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "chat_message":
            sender_id = content["senderId"]
            user_ids = list(map(int, self.chat_room_name.split("__")))
            receiver_id = \
                user_ids[1] if sender_id == user_ids[0] else user_ids[0]
            message = await self.create_message(
                sender_id, receiver_id, content=content["message"]
            )
            await self.channel_layer.group_send(
                self.chat_room_name,
                {
                    "type": "chat_message_echo",
                    "senderId": content["senderId"],
                    "content": message.content,
                    "timeStamp": str(message.timeStamp),
                },
            )
        return super().receive_json(content, **kwargs)

    # Receive message from room group
    async def chat_message_echo(self, event):
        await self.send_json(event)
