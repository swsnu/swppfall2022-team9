import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { timeStampToString } from "utils/timeStamp";
import * as S from "../styles";

interface Props {
  isConsecutive: boolean;
  content: string;
  timeStamp: string;
  imgUrl: string | undefined;
  name: string | undefined;
  userId: number | undefined;
}

const ChatMessage = forwardRef<HTMLDivElement, Props>(
  (
    { isConsecutive, content, timeStamp, imgUrl, name, userId },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const navigate = useNavigate();
    const handleClick = () => {
      if (userId && !isConsecutive) {
        navigate(`/profile/${userId}`);
      }
    };

    return name ? (
      <S.ListItemContainer
        from="otherUser"
        isConsecutive={isConsecutive}
        ref={ref}
      >
        <S.Image
          imgUrl={isConsecutive ? undefined : imgUrl}
          onClick={handleClick}
        />
        <S.NameMessageContainer>
          {!isConsecutive && <S.Name>{name}</S.Name>}
          <S.MessageContainer>
            <S.MessageContent from="otherUser">{content}</S.MessageContent>
            <S.TimeStamp>{timeStampToString(timeStamp)}</S.TimeStamp>
          </S.MessageContainer>
        </S.NameMessageContainer>
      </S.ListItemContainer>
    ) : (
      <S.ListItemContainer ref={ref} from="me" isConsecutive={isConsecutive}>
        <S.TimeStamp>{timeStampToString(timeStamp)}</S.TimeStamp>
        <S.MessageContent from="me">{content}</S.MessageContent>
      </S.ListItemContainer>
    );
  },
);

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
