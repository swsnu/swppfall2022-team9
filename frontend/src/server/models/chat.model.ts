export type ChatRoomInfo = {
  chatRoomName: string;
  otherUserName: string;
  otherUserImgUrl: string;
  lastMessage: string;
  lastTimeStamp: string;
};

export type Message = {
  senderId: number;
  content: string;
  timeStamp: string;
};
