import React from "react";
import { useNavigate } from "react-router-dom";
import { ChatRoomInfo } from "server/models/chat.model";
import { timeStampToString } from "utils/timeStamp";
import * as S from "../styles";

interface Props {
  chatRoomInfo: ChatRoomInfo;
}

const ChatRoomItem: React.FC<Props> = ({ chatRoomInfo }) => {
  const navigate = useNavigate();

  const onClickChatRoom = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    navigate(`/chat/${chatRoomInfo.chatRoomName}/`);
  };

  return (
    <S.ListItemContainer role="list" onClick={onClickChatRoom}>
      <S.ImageContainer imgUrl={chatRoomInfo.otherUserImgUrl} />
      <S.Name>{chatRoomInfo.otherUserName}</S.Name>
      <S.LastMessage>
        {chatRoomInfo.lastMessage}
        {!chatRoomInfo.isRead && <S.NotificationRedMark />}
      </S.LastMessage>
      <S.Time>{timeStampToString(chatRoomInfo.lastTimeStamp)}</S.Time>
    </S.ListItemContainer>
  );
};

export default ChatRoomItem;
