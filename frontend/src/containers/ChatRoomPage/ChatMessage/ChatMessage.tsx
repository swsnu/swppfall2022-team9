import React, { forwardRef } from "react";
import { timeStampToString } from "utils/timeStamp";
import * as S from "../styles";

interface Props {
  isConsecutive: boolean;
  content: string;
  timeStamp: string;
  imgUrl: string | undefined;
  name: string | undefined;
}

const ChatMessage = forwardRef<HTMLDivElement, Props>(
  (
    { isConsecutive, content, timeStamp, imgUrl, name },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return name ? (
      <S.ListItemContainer
        from="otherUser"
        isConsecutive={isConsecutive}
        ref={ref}
      >
        <S.Image imgUrl={isConsecutive ? undefined : imgUrl} />
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
