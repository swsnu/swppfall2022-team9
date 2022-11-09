import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { putSignOut } from "store/slices/users";
import * as FormStyles from "styles/common.form.styles";

const AccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // TODO: change birthDate
  const onClickChangeBirthDate = () => {};

  const onClickChangePassword = () => {
    navigate("/account/password");
  };
  const onClickLogout = () => {
    dispatch(putSignOut());
  };

  // TODO: delete account
  const onClickDeleteAccount = () => {};

  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>개인 정보</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form
          onSubmit={e => {
            // prevent refresh
            e.preventDefault();
          }}
        >
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
              <FormStyles.InputModifyButton onClick={onClickChangeBirthDate}>
                수정
              </FormStyles.InputModifyButton>
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>비밀번호</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.FormInnerButton
                style={{ fontWeight: "bold" }}
                onClick={onClickChangePassword}
              >
                비밀번호 변경하기
              </FormStyles.FormInnerButton>
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Submit backgroundColor="#D9D9D9" onClick={onClickLogout}>
            로그아웃
          </FormStyles.Submit>
          <FormStyles.Submit
            backgroundColor="transparent"
            style={{
              fontSize: 12,
              opacity: 0.6,
              fontWeight: "lighter",
            }}
            onClick={onClickDeleteAccount}
          >
            계정삭제
          </FormStyles.Submit>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default AccountPage;
