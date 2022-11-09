import useAlert from "hooks/useAlert";
import React, { useState } from "react";
import * as FormStyles from "styles/common.form.styles";

enum ForgotAccountType {
  USERNAME = "USERNAME",
  PASSWORD = "PASSWORD",
}
const ForgotAccountPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  // TODO: remove "test" from useState
  const [usernameResult, setUsernameResult] = useState<string>("test");
  const [forgotAccountType, setForgotAccountType] = useState<ForgotAccountType>(
    ForgotAccountType.USERNAME,
  );

  const alert = useAlert();

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    //TODO: implement forgot account logic (use redux account reducer)
    switch (forgotAccountType) {
      case ForgotAccountType.USERNAME:
        //TODO implement this with dispatch
        setUsernameResult("hunkim98");
        break;
      case ForgotAccountType.PASSWORD:
        //TODO implement this with dispatch
        alert.open({ message: "인증 이메일이 보내졌습니다." });
        break;
    }
  };

  const inputValue = (type: ForgotAccountType) => {
    switch (type) {
      case ForgotAccountType.USERNAME:
        return email;
      case ForgotAccountType.PASSWORD:
        return username;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (forgotAccountType === ForgotAccountType.USERNAME) {
      setEmail(event.target.value);
    } else {
      setUsername(event.target.value);
    }
  };

  const submitButtonText = (type: ForgotAccountType) => {
    switch (type) {
      case ForgotAccountType.USERNAME:
        return "아이디 조회";
      case ForgotAccountType.PASSWORD:
        return "인증 이메일 보내기";
    }
  };

  const inputLabelText = (type: ForgotAccountType) => {
    switch (type) {
      case ForgotAccountType.USERNAME:
        return "이메일 입력";
      case ForgotAccountType.PASSWORD:
        return "아이디 입력";
    }
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
                <FormStyles.OptionCheckBox
                  role="findIdCheck"
                  checked={forgotAccountType === ForgotAccountType.USERNAME}
                  onChange={() => {
                    setForgotAccountType(ForgotAccountType.USERNAME);
                    setUsername("");
                    setUsernameResult("");
                  }}
                />
                <FormStyles.OptionText>아이디 찾기</FormStyles.OptionText>
              </FormStyles.Option>
              <FormStyles.Option>
                <FormStyles.OptionCheckBox
                  role="findPasswordCheck"
                  checked={forgotAccountType === ForgotAccountType.PASSWORD}
                  onChange={() => {
                    setForgotAccountType(ForgotAccountType.PASSWORD);
                    setUsernameResult("");
                  }}
                />
                <FormStyles.OptionText>비밀번호 찾기</FormStyles.OptionText>
              </FormStyles.Option>
            </FormStyles.OptionsContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>
              {inputLabelText(forgotAccountType)}
            </FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                role="forgotAccountInput"
                value={inputValue(forgotAccountType)}
                onChange={handleInputChange}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Submit
            type="submit"
            onClick={onSubmit}
            style={{
              marginTop: 20,
              width: "100%",
              maxWidth: 340,
              fontWeight: "bold",
            }}
          >
            {submitButtonText(forgotAccountType)}
          </FormStyles.Submit>
          {usernameResult && (
            <FormStyles.ExtraContainer>{`당신의 아이디는 ${usernameResult}입니다`}</FormStyles.ExtraContainer>
          )}
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default ForgotAccountPage;
