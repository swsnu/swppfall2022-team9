import React from "react";
import * as FormStyles from "styles/common.form.styles";

const AccountPage = () => {
  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>개인 정보</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form>
          <FormStyles.Label>
            <FormStyles.LabelText>성</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input disabled={true} />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>이름</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input disabled={true} />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>이메일</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input disabled={true} />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>생년월일</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input />
              <FormStyles.InputModifyButton>수정</FormStyles.InputModifyButton>
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>비밀번호</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.FormInnerButton>
                비밀번호 변경하기
              </FormStyles.FormInnerButton>
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.FormInnerButton
            backgroundColor="#D9D9D9"
            style={{
              marginTop: 20,
              width: "70%",
            }}
          >
            로그아웃
          </FormStyles.FormInnerButton>
          <FormStyles.FormInnerButton
            backgroundColor="transparent"
            style={{
              marginTop: 25,
              fontSize: 12,
              opacity: 0.6,
              fontWeight: "lighter",
              width: "70%",
            }}
          >
            계정삭제
          </FormStyles.FormInnerButton>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default AccountPage;
