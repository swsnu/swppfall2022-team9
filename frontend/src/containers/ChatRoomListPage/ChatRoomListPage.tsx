import React, { useEffect } from "react";
import ChatRoomItem from "./ChatRoomItem/ChatRoomItem";
import * as S from "./styles";
import { getChatRoomInfoList } from "store/slices/chat";
import { useAppDispatch, useAppSelector } from "store/hooks";

interface Props {}

const ChatRoomListPage: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const chatRoomInfoList = useAppSelector(state => state.chat.chatRoomInfoList);

  useEffect(() => {
    dispatch(getChatRoomInfoList());
  }, []);

  return (
    <S.Container>
      <S.Title>채팅 목록</S.Title>
      <S.ListContainer>
        {chatRoomInfoList.length === 0 ? (
          <S.ChatRoomEmptyContainer>
            아직 진행 중인 채팅이 없습니다
          </S.ChatRoomEmptyContainer>
        ) : (
          chatRoomInfoList.map((chatRoomInfo, index) => {
            return <ChatRoomItem key={index} chatRoomInfo={chatRoomInfo} />;
          })
        )}
      </S.ListContainer>
    </S.Container>
  );
};

export default ChatRoomListPage;
