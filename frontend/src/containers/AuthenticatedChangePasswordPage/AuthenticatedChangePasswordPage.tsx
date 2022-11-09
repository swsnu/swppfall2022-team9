import React, { useState } from "react";
import * as FormStyles from "styles/common.form.styles";

const AuthenticatedChangePasswordPage: React.FC = () => {
  const [passwordInfo, setPasswordInfo] = useState<{
    currentPassword: string;
    password: string;
    passwordCheck: string;
  }>({ currentPassword: "", password: "", passwordCheck: "" });

  const onSubmit = (e: React.SyntheticEvent) => {
    if (
      !passwordInfo.currentPassword &&
      !passwordInfo.password &&
      !passwordInfo.passwordCheck
    ) {
      return;
    }
    // TODO: Check if current password matches the real password
    e.preventDefault();
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
                placeholder="새로운 비밀번호"
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
            type="submit"
            onClick={onSubmit}
            style={{
              marginTop: 20,
              width: "100%",
              maxWidth: 340,
              fontWeight: "bold",
            }}
          >
            비밀반호 변경
          </FormStyles.FormInnerButton>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default AuthenticatedChangePasswordPage;
