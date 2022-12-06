import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useNavigate } from "react-router-dom";
import useAlert from "hooks/useAlert";
import { putPassword } from "store/slices/account";
import * as FormStyles from "styles/common.form.styles";
import { postSignIn } from "../../store/slices/users";

const AuthenticatedChangePasswordPage: React.FC = () => {
  const [passwordInfo, setPasswordInfo] = useState<{
    currentPassword: string;
    password: string;
    passwordCheck: string;
  }>({ currentPassword: "", password: "", passwordCheck: "" });
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (
      !passwordInfo.currentPassword ||
      !passwordInfo.password ||
      !passwordInfo.passwordCheck
    ) {
      return;
    }
    // TODO: Check if current password matches the real password
    try {
      await dispatch(
        postSignIn({
          username: currentUser!.username,
          password: passwordInfo.currentPassword,
        }),
      ).unwrap();
      if (passwordInfo.currentPassword !== passwordInfo.password) {
        if (passwordInfo.password !== passwordInfo.passwordCheck) {
          alert.open({
            message: "입력하신 새 비밀번호가 서로 일치하지 않습니다.",
          });
        } else {
          const result = await dispatch(
            putPassword({
              newPassword: passwordInfo.password,
            }),
          );
          if (result.type === `${putPassword.typePrefix}/fulfilled`) {
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
          } else {
            alert.open({
              message: "비밀번호 변경에 실패하였습니다.",
            });
          }
        }
      } else {
        alert.open({
          message: "현재 비밀번호와 동일합니다.",
        });
      }
    } catch (err) {
      alert.open({
        message: "비밀번호가 틀립니다.",
      });
    }
  };

  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>비밀번호 변경</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form onSubmit={onSubmit}>
          <FormStyles.Label>
            <FormStyles.LabelText>현재 비밀번호</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
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
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>새로운 비밀번호</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                type="password"
                role="passwordInput"
                placeholder="새로운 비밀번호"
                value={passwordInfo.password}
                onChange={e => {
                  setPasswordInfo(prev => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>비밀번호 확인</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                type="password"
                role="passwordCheckInput"
                placeholder="비밀번호 확인"
                value={passwordInfo.passwordCheck}
                onChange={e => {
                  setPasswordInfo(prev => ({
                    ...prev,
                    passwordCheck: e.target.value,
                  }));
                }}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.FormInnerButton
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
          </FormStyles.FormInnerButton>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default AuthenticatedChangePasswordPage;
