import React, { useState, useCallback } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useAppDispatch } from "store/hooks";
import { PostSignInDto } from "server/dto/users/users.dto";
import { postSignIn } from "store/slices/users";
import * as S from "./styles";
import { useNavigate } from "react-router-dom";
import useAlert from "hooks/useAlert";

interface Props {
  message: string;
}

const LoginModal: React.FC<Props> = ({ message }) => {
  const alert = useAlert();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState<PostSignInDto>({
    username: "",
    password: "",
  });

  const onSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      try {
        await dispatch(
          postSignIn({
            username: loginInfo.username,
            password: loginInfo.password,
          }),
        );
      } catch (err) {
        alert.open({ message: "로그인 정보가 잘못되었습니다!" });
      }
    },
    [alert, loginInfo],
  );

  const onClickSignUp = () => {
    navigate("/signup");
  };

  return (
    <S.Container>
      <S.ModalContainer
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <S.CloseButtonContainer>
          <IoCloseOutline
            style={{
              cursor: "pointer",
            }}
            color="#D9D9D9"
            size="100%"
          />
        </S.CloseButtonContainer>
        <S.GuideContainer>
          <S.Title>로그인</S.Title>
          <S.UserOptions>
            <S.Register onClick={onClickSignUp}>회원가입</S.Register>
            <S.FindAccount>아이디/비밀번호 찾기</S.FindAccount>
          </S.UserOptions>
        </S.GuideContainer>
        <S.Form onSubmit={onSubmit}>
          <S.Label>
            <S.LabelText>이메일(아이디)</S.LabelText>
            <S.Input
              type="text"
              placeholder="이메일"
              name="email"
              autoComplete="on"
              onChange={e => {
                setLoginInfo(prev => ({ ...prev, email: e.target.value }));
              }}
            />
          </S.Label>
          <S.Label>
            <S.LabelText>비밀번호</S.LabelText>
            <S.Input
              type="password"
              name="password"
              autoComplete="on"
              placeholder="비밀번호"
              onChange={e => {
                setLoginInfo(prev => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </S.Label>
          <S.Message>{message}</S.Message>
          <S.Submit type="submit" onSubmit={onSubmit}>
            로그인하기
          </S.Submit>
        </S.Form>
      </S.ModalContainer>
    </S.Container>
  );
};

export default LoginModal;
