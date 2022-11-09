import React from "react";
import * as FormStyles from "styles/common.form.styles";

const ForgotAccountPage: React.FC = () => {
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>아아디/비밀번호 찾기</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form onSubmit={onSubmit}>
          <FormStyles.Label>
            <FormStyles.OptionsContainer>
              <FormStyles.Option>
                <FormStyles.OptionCheckBox />
                <FormStyles.OptionText>아이디 찾기</FormStyles.OptionText>
              </FormStyles.Option>
              <FormStyles.Option>
                <FormStyles.OptionCheckBox />
                <FormStyles.OptionText>비밀번호 찾기</FormStyles.OptionText>
              </FormStyles.Option>
            </FormStyles.OptionsContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.InputContainer></FormStyles.InputContainer>
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

export default ForgotAccountPage;
