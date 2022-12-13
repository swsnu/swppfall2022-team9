export type ChatRoomInfo = {
  chatRoomName: string;
  otherUserId: number;
  otherUserName: string;
  otherUserImgUrl: string;
  senderId: number;
  lastMessage: string;
  isRead: boolean;
  lastTimeStamp: string;
};

export type Message = {
  senderId: number;
  content: string;
  timeStamp: string;
};
