import useAlert from "hooks/useAlert";
import React, { useState } from "react";
import { useAppDispatch } from "store/hooks";
import { getForgotUsername, postForgotPassword } from "store/slices/account";
import * as FormStyles from "styles/common.form.styles";

enum ForgotAccountType {
  USERNAME = "USERNAME",
  PASSWORD = "PASSWORD",
}

const ForgotAccountPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [usernameResult, setUsernameResult] = useState<string>("");
  const [forgotAccountType, setForgotAccountType] = useState<ForgotAccountType>(
    ForgotAccountType.USERNAME,
  );
  const dispatch = useAppDispatch();
  const alert = useAlert();

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    switch (forgotAccountType) {
      case ForgotAccountType.USERNAME:
        if (!email) return;
        try {
          const response = await dispatch(getForgotUsername(email)).unwrap();
          setUsernameResult(response.username);
        } catch (err) {
          setUsernameResult("");
          const status = err as number;
          if (status === 404) {
            alert.open({
              message: "해당 이메일로 등록된 사용자 정보가 없습니다.",
            });
          } else {
            alert.open({ message: "[서버 오류] 아이디 찾기에 실패했습니다." });
          }
        }
        break;
      case ForgotAccountType.PASSWORD:
        if (!username) return;
        try {
          alert.open({ message: "처리 중입니다...", buttons: [] });
          await dispatch(postForgotPassword(username)).unwrap();
          alert.open({ message: "등록된 이메일로 링크가 전송되었습니다." });
        } catch (err) {
          const status = err as number;
          if (status === 404) {
            alert.open({
              message: "해당 아이디로 등록된 사용자 정보가 없습니다.",
            });
          } else {
            alert.open({
              message: "[서버 오류] 비밀번호 찾기에 실패했습니다.",
            });
          }
        }
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
          <FormStyles.HeaderText>아이디 / 비밀번호 찾기</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form onSubmit={onSubmit}>
          <FormStyles.Label>
            <FormStyles.OptionsContainer>
              <FormStyles.Option>
                <FormStyles.OptionCheckBox
                  role="findIdCheck"
                  type="checkbox"
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
                  type="checkbox"
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
                placeholder={
                  forgotAccountType === ForgotAccountType.USERNAME
                    ? "email@snu.ac.kr"
                    : "User ID"
                }
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
            <FormStyles.UsernameContainer>
              <FormStyles.UsernameText>당신의 아이디는</FormStyles.UsernameText>
              <FormStyles.Username>{usernameResult}</FormStyles.Username>
              <FormStyles.UsernameText>입니다</FormStyles.UsernameText>
            </FormStyles.UsernameContainer>
          )}
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default ForgotAccountPage;
