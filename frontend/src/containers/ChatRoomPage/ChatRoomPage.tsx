import React, { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import * as S from "./styles";
import { Message } from "server/models/chat.model";
import ChatMessage from "./ChatMessage/ChatMessage";
import { compareTimeStampWtihinDay } from "utils/timeStamp";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getCurrentChatRoomInfo } from "store/slices/chat";
interface Props {}

const isDevMode = process.env.NODE_ENV === "development";

const ChatRoomPage: React.FC<Props> = () => {
  const { chatRoomName } = useParams();
  const [searchParams] = useSearchParams();
  const coffeeChatName = searchParams.get("name");
  const currentUser = useAppSelector(state => state.users.currentUser);
  const currentChatRoomInfo = useAppSelector(
    state => state.chat.currentChatRoomInfo,
  );
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [messageLog, setMessageLog] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const messageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wsScheme = isDevMode ? "ws" : "wss";
  const serverAddress = isDevMode ? "127.0.0.1:8000" : "hoshiwoobo.shop:8001";
  const { sendJsonMessage } = useWebSocket(
    currentUser ? `${wsScheme}://${serverAddress}/ws/${chatRoomName}/` : null,
    {
      onOpen: () => {
        console.log("Connected!");
        setIsConnected(true);
      },
      onClose: () => {
        console.log("Disconnected!");
        setIsConnected(false);
      },
      onMessage: (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "chat_message_echo":
            setMessageLog(prev => prev.concat(data));
            if (currentUser) {
              sendJsonMessage({
                type: "read_messages",
                senderId: currentUser.id,
              });
            }
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

  useEffect(() => {
    if (isConnected && currentUser) {
      sendJsonMessage({
        type: "read_messages",
        senderId: currentUser.id,
      });
    }
  }, [sendJsonMessage, isConnected, currentUser]);

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
    if (currentUser) {
      if (chatRoomName) dispatch(getCurrentChatRoomInfo({ chatRoomName }));
      if (coffeeChatName) {
        sendJsonMessage({
          type: "chat_message",
          senderId: currentUser.id,
          message: `?????? ${coffeeChatName} ??? ????????? ??? ??? ???????`,
        });
      }
    }
  }, [currentUser]);

  return (
    <S.BackgroundContainer>
      <S.Container>
        <S.Title>{`${currentChatRoomInfo?.otherUserName} ????????? ??????`}</S.Title>
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
                    messageLog[idx].senderId === messageLog[idx - 1].senderId &&
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
            placeholder={
              isConnected
                ? "???????????? ???????????????"
                : "???????????? ????????? ?????????????????????."
            }
            disabled={!isConnected}
            onChange={e => {
              setMessageInput(e.target.value);
            }}
          ></S.Input>
          <S.Submit
            type="submit"
            disabled={!isConnected || messageInput === ""}
          >
            ??????
          </S.Submit>
        </S.Form>
      </S.Container>
      <S.GoToChatRoomListPageButton
        onClick={() => {
          navigate("/chat/");
        }}
      >
        <BiLeftArrowAlt size={22} />
        ?????? ???????????? ????????????
      </S.GoToChatRoomListPageButton>
    </S.BackgroundContainer>
  );
};

export default ChatRoomPage;
