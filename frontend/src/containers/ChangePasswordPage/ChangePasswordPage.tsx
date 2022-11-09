import SingleMessagePage from "components/SingleMessagePage/SingleMessagePage";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as FormStyles from "styles/common.form.styles";

const ChangePasswordPage: React.FC = () => {
  const { token } = useParams();
  const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    // TODO check if the token is verified!
  }, [token]);
  const onSubmit = (e: React.SyntheticEvent) => {
    // TODO change password dispatch implementation
    e.preventDefault();
  };

  const goToForgotAccount = () => {
    navigate("/account/forgot");
  };

  if (!isTokenVerified) {
    return (
      <SingleMessagePage
        message="비밀번호 변경 유효시간이 만료되었습니다. 다시 비밀번호 찾기를 진행해주세요"
        isButtonVisible={true}
        buttonText="아이디/비밀번호 찾기 페이지로 이동"
        onClickButton={goToForgotAccount}
      />
    );
  }
  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>비밀번호 변경</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form onSubmit={onSubmit}>
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
