import React from "react";
import * as FormStyles from "styles/common.form.styles";

const ChangePasswordPage: React.FC = () => {
  const onSubmit = (e: React.SyntheticEvent) => {
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
              <FormStyles.Input />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>새로운 비밀번호</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>비밀번호 확인</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input />
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

export default ChangePasswordPage;
