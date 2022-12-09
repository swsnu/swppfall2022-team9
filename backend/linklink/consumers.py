"""
consumers to handle chat feature
"""

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from linklink.models import ChatRoom, Message, LinkLinkUser


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """NotificationConsumer class for LinkLink"""
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.user_id = None
        self.notification_group_name = None

    @database_sync_to_async
    def get_unread(self):
        unread_count = Message.objects.filter(
            receiver_id=self.user_id, read=False
        ).count()
        return unread_count

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        # private notification group
        self.notification_group_name = self.user_id + "__notifications"
        await self.channel_layer.group_add(
            self.notification_group_name, self.channel_name
        )
        await self.accept()
        unread_count = await self.get_unread()

        await self.send_json({"type": "unread_count", "messages": unread_count})

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.notification_group_name,
            self.channel_name,
        )
        return super().disconnect(code)

    async def new_message_notification(self, event):
        await self.send_json(event)

    async def unread_count(self, event):
        await self.send_json(event)


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
            self.chat_room_name, self.channel_name
        )
        await self.accept()
        self.chat_room = await self.get_chatroom()

        # Send last 50 messages
        last_50_messages = await self.get_last_50_messages()
        await self.send_json(
            {"type": "last_50_messages", "messages": last_50_messages}
        )

    async def disconnect(self, code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.chat_room_name, self.channel_name
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
    # pylint:disable=unused-argument
    def enter_chatroom_get_unread(self, current_user_id, receiver_id):
        messages = self.chat_room.messages.filter(
            receiver_id=current_user_id, read=False
        )
        # Message.objects.filter(receiver=receiver_id, read=False)
        for message in messages:
            message.read = True
            message.save()
        unread_count = Message.objects.filter(
            receiver=current_user_id, read=False
        ).count()

        return unread_count

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

            notification_group_name = str(receiver_id) + "__notifications"
            await self.channel_layer.group_send(
                notification_group_name,
                {
                    "type": "new_message_notification",
                    "senderId": sender_id,
                    "receiverId": receiver_id,
                    "message": message.content,
                },
            )
        elif message_type == "read_messages":
            sender_id = content["senderId"]
            current_user_id = sender_id
            user_ids = list(map(int, self.chat_room_name.split("__")))
            receiver_id = \
                user_ids[1] if sender_id == user_ids[0] else user_ids[0]
            unread_count = await self.enter_chatroom_get_unread(
                current_user_id=current_user_id, receiver_id=receiver_id
            )
            # send unread_count to user
            notification_group_name = str(current_user_id) + "__notifications"
            await self.channel_layer.group_send(
                notification_group_name,
                {
                    "type": "unread_count",
                    "messages": unread_count,
                },
            )

        return super().receive_json(content, **kwargs)

    async def unread_count(self, event):
        await self.send_json(event)

    # Receive message from room group
    async def chat_message_echo(self, event):
        await self.send_json(event)

    async def new_message_notification(self, event):
        await self.send_json(event)
