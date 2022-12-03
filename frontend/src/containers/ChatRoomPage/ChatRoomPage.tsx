import React, { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import * as S from "./styles";
import { Message } from "server/models/chat.model";
import ChatMessage from "./ChatMessage/ChatMessage";
import { compareTimeStampWtihinDay } from "utils/timeStamp";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getCurrentChatRoomInfo } from "store/slices/chat";
interface Props {}

const ChatRoomPage: React.FC<Props> = () => {
  const { chatRoomName } = useParams();
  const currentUser = useAppSelector(state => state.users.currentUser);
  const currentChatRoomInfo = useAppSelector(
    state => state.chat.currentChatRoomInfo,
  );
  const [messageLog, setMessageLog] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const messageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { sendJsonMessage } = useWebSocket(
    currentUser ? `ws://127.0.0.1:8000/${chatRoomName}/` : null,
    {
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      onMessage: (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "chat_message_echo":
            setMessageLog(prev => prev.concat(data));
            break;
          case "last_50_messages":
            setMessageLog(data.messages);
            break;
          default:
            console.error("Unknown message type!");
            break;
        }
      },
    },
  );

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    sendJsonMessage({
      type: "chat_message",
      senderId: currentUser!.id,
      message: messageInput,
    });
    setMessageInput("");
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView();
  }, [messageLog]);

  useEffect(() => {
    if (chatRoomName) dispatch(getCurrentChatRoomInfo({ chatRoomName }));
  }, []);

  return (
    <S.Container>
      <S.Title>{`${currentChatRoomInfo?.otherUserName} 님과의 채팅`}</S.Title>
      <S.ListContainer>
        {currentUser &&
          currentChatRoomInfo &&
          messageLog.map((message, idx) => {
            return (
              <ChatMessage
                ref={messageRef}
                key={idx}
                isConsecutive={
                  idx > 0 &&
                  messageLog[idx].senderId == messageLog[idx - 1].senderId &&
                  compareTimeStampWtihinDay(
                    messageLog[idx].timeStamp,
                    messageLog[idx - 1].timeStamp,
                  )
                }
                content={message.content}
                timeStamp={message.timeStamp}
                userId={
                  message.senderId == currentUser.id
                    ? undefined
                    : currentChatRoomInfo.otherUserId
                }
                name={
                  message.senderId == currentUser.id
                    ? undefined
                    : currentChatRoomInfo.otherUserName
                }
                imgUrl={
                  message.senderId == currentUser.id
                    ? undefined
                    : currentChatRoomInfo.otherUserImgUrl
                }
              />
            );
          })}
      </S.ListContainer>
      <S.Form onSubmit={handleSubmit}>
        <S.Input
          type="text"
          autoFocus
          value={messageInput}
          onChange={e => {
            setMessageInput(e.target.value);
          }}
        ></S.Input>
        <S.Submit type="submit">전송</S.Submit>
      </S.Form>
    </S.Container>
  );
};

export default ChatRoomPage;
