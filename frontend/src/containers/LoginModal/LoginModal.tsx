import React, { useState, useCallback } from "react";
import { useAppDispatch } from "store/hooks";
import { PostSignInDto } from "server/dto/users/users.dto";
import { postSignIn } from "store/slices/users";
import * as S from "./styles";
import { useNavigate } from "react-router-dom";
import useAlert from "hooks/useAlert";
import WelcomeMessage from "assets/img/welcome-message.png";

export enum LoginModalMessage {
  NULL = "",
  SESSION_EXPIRED = "세션이 만료되었습니다. 다시 로그인해주세요.",
  LOGIN_FAIL = "아이디 또는 비밀번호가 올바르지 않습니다.",
}

const LoginModal: React.FC = () => {
  const alert = useAlert();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState<LoginModalMessage>(
    LoginModalMessage.NULL,
  );
  const [loginInfo, setLoginInfo] = useState<PostSignInDto>({
    username: "",
    password: "",
  });

  const onSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      dispatch(
        postSignIn({
          username: loginInfo.username,
          password: loginInfo.password,
        }),
      )
        .unwrap()
        .then(() => {})
        .catch(err => {
          if (err.status === 401) {
            alert.open({
              message:
                "이미엘 인증이 아직 완료되지 않은 유저입니다. 이메일을 확인해주세요.",
            });
          }
          setLoginMessage(LoginModalMessage.LOGIN_FAIL);
        });
    },
    [alert, loginInfo],
  );

  const onClickSignUp = () => {
    navigate("/signup");
  };

  const onClickFindAccount = () => {
    navigate("/account/forgot");
  };

  return (
    <S.Container>
      <S.ModalContainer
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <S.WelcomeContainer>
          <img src={WelcomeMessage} alt={"welcome"} style={{ width: "100%" }} />
          <S.DescriptionContainer>
            친구들의 친구들을 알게 되는 인간관계 지도 서비스
          </S.DescriptionContainer>
        </S.WelcomeContainer>

        <S.Form onSubmit={onSubmit}>
          <S.Label>
            <S.LabelText>아이디</S.LabelText>
            <S.Input
              type="text"
              placeholder="아이디"
              name="username"
              role="username"
              autoComplete="on"
              onChange={e => {
                setLoginInfo(prev => ({ ...prev, username: e.target.value }));
              }}
            />
          </S.Label>
          <S.Label>
            <S.LabelText>비밀번호</S.LabelText>
            <S.Input
              type="password"
              name="password"
              role="password"
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
          <S.Message>{loginMessage}</S.Message>
          <S.Submit type="submit" onSubmit={onSubmit}>
            로그인하기
          </S.Submit>
        </S.Form>
        <S.GuideContainer>
          <S.Register onClick={onClickSignUp}>회원가입</S.Register>
          <S.FindAccount onClick={onClickFindAccount}>
            아이디/비밀번호 찾기
          </S.FindAccount>
        </S.GuideContainer>
      </S.ModalContainer>
    </S.Container>
  );
};

export default LoginModal;
