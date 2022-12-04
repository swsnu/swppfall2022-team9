import { ChatRoomInfo, Message } from "../models/chat.model";

export const chatRoomInfoListStub: ChatRoomInfo[] = [
  {
    chatRoomName: "1__2",
    otherUserId: 2,
    otherUserName: "박신혜",
    otherUserImgUrl:
      "https://res.cloudinary.com/duyixodey/image/upload/v1669881484/shinhye_park_qqrin4.jpg",
    lastMessage: "hello",
    lastTimeStamp: "2022-12-03T15:57:37.039Z",
  },
  {
    chatRoomName: "1__3",
    otherUserId: 3,
    otherUserName: "서현진",
    otherUserImgUrl:
      "https://res.cloudinary.com/duyixodey/image/upload/v1669881618/hyunjin_seo_o8r96j.jpg",
    lastMessage: "hi",
    lastTimeStamp: "2022-12-03T16:57:37.039Z",
  },
];

export const messageLogStub: Message[] = [
  {
    senderId: 1,
    content: "hello from AM",
    timeStamp: "2022-12-03T11:03:37.039Z",
  },
  {
    senderId: 1,
    content: "hello",
    timeStamp: "2022-12-03T16:57:37.039Z",
  },
  {
    senderId: 2,
    content: "hello",
    timeStamp: "2022-12-03T16:57:37.039Z",
  },
  {
    senderId: 2,
    content: "hello",
    timeStamp: "2022-12-03T16:57:39.039Z",
  },
  {
    senderId: 1,
    content: "hello",
    timeStamp: "2022-12-03T16:59:37.039Z",
  },
];
