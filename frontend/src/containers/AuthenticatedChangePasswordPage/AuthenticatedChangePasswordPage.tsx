import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useNavigate } from "react-router-dom";
import useAlert from "hooks/useAlert";
import { putPassword } from "store/slices/account";
import * as S from "../SignUpPage/styles";
import { postSignIn } from "../../store/slices/users";
import { HelperText } from "styles/common.form.styles";

const AuthenticatedChangePasswordPage: React.FC = () => {
  const [passwordInfo, setPasswordInfo] = useState<{
    currentPassword: string;
    password: string;
    passwordConfirm: string;
  }>({ currentPassword: "", password: "", passwordConfirm: "" });
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitClicked(true);
    if (
      passwordInfo.currentPassword &&
      passwordInfo.password &&
      passwordInfo.passwordConfirm &&
      passwordInfo.password === passwordInfo.passwordConfirm
    ) {
      try {
        await dispatch(
          postSignIn({
            username: currentUser!.username,
            password: passwordInfo.currentPassword,
          }),
        ).unwrap();
        if (passwordInfo.currentPassword !== passwordInfo.password) {
          try {
            await dispatch(
              putPassword({
                newPassword: passwordInfo.password,
              }),
            ).unwrap();
            alert.open({
              message: `비밀번호가 변경되었습니다.`,
              buttons: [
                {
                  label: "확인",
                  onClick: () => {
                    alert.close();
                    navigate("/");
                  },
                },
              ],
            });
          } catch (err) {
            alert.open({
              message: "비밀번호 변경에 실패했습니다.",
            });
          }
        } else {
          alert.open({
            message: "현재 비밀번호와 동일합니다.",
          });
        }
      } catch (err) {
        alert.open({
          message: "현재 비밀번호가 올바르지 않습니다.",
        });
      }
    }
  };

  return (
    <S.Container>
      <S.FormContainer>
        <S.Header>
          <S.HeaderText>비밀번호 변경</S.HeaderText>
        </S.Header>
        <S.Form onSubmit={onSubmit}>
          <S.Label>
            <S.LabelText>현재 비밀번호</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="password"
                role="currentPasswordInput"
                placeholder="현재 비밀번호"
                value={passwordInfo.currentPassword}
                onChange={e => {
                  setPasswordInfo(prev => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {passwordInfo.currentPassword
                    ? HelperText.NO_ERROR
                    : HelperText.REQUIRED}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
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
            role="submit"
            type="submit"
            onClick={onSubmit}
            style={{
              marginTop: 20,
              width: "100%",
              maxWidth: 340,
              fontWeight: "bold",
            }}
          >
            비밀번호 변경
          </S.Submit>
        </S.Form>
      </S.FormContainer>
    </S.Container>
  );
};

export default AuthenticatedChangePasswordPage;
