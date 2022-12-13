import useAlert from "hooks/useAlert";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { putForgotPassword } from "store/slices/account";

import { HelperText } from "styles/common.form.styles";
import * as S from "../SignUpPage/styles";

const ChangePasswordPage: React.FC = () => {
  const { token } = useParams();
  const [passwordInfo, setPasswordInfo] = useState<{
    password: string;
    passwordConfirm: string;
  }>({ password: "", passwordConfirm: "" });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const alert = useAlert();

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitClicked(true);
    if (
      passwordInfo.password &&
      passwordInfo.passwordConfirm &&
      passwordInfo.password === passwordInfo.passwordConfirm
    ) {
      try {
        await dispatch(
          putForgotPassword({
            token: token!,
            newPassword: passwordInfo.password,
          }),
        ).unwrap();
        alert.open({
          message: `비밀번호가 재설정되었습니다.`,
          buttons: [
            {
              label: "홈페이지로 이동",
              onClick: () => {
                alert.close();
                navigate("/");
              },
            },
          ],
        });
      } catch (err) {
        const status = err as number;
        if (status === 401) {
          alert.open({
            message:
              "비밀번호 재설정 유효시간이 만료되었습니다. 비밀번호 찾기를 다시 진행해주세요",
            buttons: [
              {
                label: "아이디/비밀번호 찾기 페이지로 이동",
                onClick: () => {
                  alert.close();
                  navigate("/account/forgot");
                },
              },
            ],
          });
        } else if (status === 404) {
          alert.open({
            message: "유효하지 않은 토큰입니다.",
          });
        } else {
          alert.open({
            message: "[서버 오류] 비밀번호 재설정에 실패했습니다.",
          });
        }
      }
    }
  };

  return (
    <S.Container>
      <S.FormContainer>
        <S.Header>
          <S.HeaderText>비밀번호 재설정</S.HeaderText>
        </S.Header>
        <S.Form onSubmit={onSubmit}>
          <S.Label>
            <S.LabelText>새 비밀번호</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="password"
                role="passwordInput"
                placeholder="새 비밀번호"
                value={passwordInfo.password}
                onChange={e => {
                  setPasswordInfo(prev => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {passwordInfo.password
                    ? HelperText.NO_ERROR
                    : HelperText.REQUIRED}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
          <S.Label>
            <S.LabelText>비밀번호 확인</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="password"
                role="passwordCheckInput"
                placeholder="비밀번호 확인"
                value={passwordInfo.passwordConfirm}
                onChange={e => {
                  setPasswordInfo(prev => ({
                    ...prev,
                    passwordConfirm: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {passwordInfo.password === passwordInfo.passwordConfirm
                    ? passwordInfo.passwordConfirm
                      ? HelperText.NO_ERROR
                      : HelperText.REQUIRED
                    : HelperText.DIFFERENT_PASSWORD}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
          <S.Submit
            type="submit"
            role="submit"
            onClick={onSubmit}
            style={{
              marginTop: 0,
            }}
          >
            비밀번호 재설정하기
          </S.Submit>
        </S.Form>
      </S.FormContainer>
    </S.Container>
  );
};

export default ChangePasswordPage;
