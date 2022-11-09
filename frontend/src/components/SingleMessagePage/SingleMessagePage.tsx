import React from "react";
import * as S from "./styles";

interface Props {
  message: string;
  isButtonVisible: boolean;
  onClickButton: () => void;
  buttonText: string;
}

const SingleMessagePage: React.FC<Props> = ({
  message,
  onClickButton,
  isButtonVisible,
  buttonText,
}) => {
  return (
    <S.Container>
      <S.ContentContainer>
        <S.Message role="message">{message}</S.Message>
        {isButtonVisible && (
          <S.ButtonsContainer>
            <S.Button role="simpleMessageButton" onClick={onClickButton}>
              {buttonText}
            </S.Button>
          </S.ButtonsContainer>
        )}
      </S.ContentContainer>
    </S.Container>
  );
};

export default SingleMessagePage;
