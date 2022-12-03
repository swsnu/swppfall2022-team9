import { ChatRoomInfo } from "../../models/chat.model";

export interface GetChatRoomInfoListResDto {
  chatRoomInfoList: ChatRoomInfo[];
}

export interface GetChatRoomInfoResDto extends ChatRoomInfo {}
