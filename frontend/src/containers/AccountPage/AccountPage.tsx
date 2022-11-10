import useAlert from "hooks/useAlert";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { getSignOut } from "store/slices/users";
import * as FormStyles from "styles/common.form.styles";

const AccountPage: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    birthdate: string;
  }>({
    firstname: "",
    lastname: "",
    email: "",
    birthdate: new Date().toISOString().slice(0, 10),
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alert = useAlert();

  // TODO: connect with redux (fill in the blank inputs)

  const onClickChangePassword = () => {
    navigate("/account/password");
  };
  const onClickLogout = () => {
    dispatch(getSignOut());
  };

  // TODO: delete account
  const onClickDeleteAccount = () => {
    alert.open({
      message: "계정 삭제를 진행할까요?",
      buttons: [
        {
          label: "네",
          onClick: () => {
            //TODO dispatch
          },
        },
        {
          label: "아니오",
          onClick: () => {
            alert.close();
          },
        },
      ],
    });
  };

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
              <FormStyles.Input
                role="lastname"
                disabled={true}
                value={accountInfo.lastname}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>이름</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                role="firstname"
                disabled={true}
                value={accountInfo.firstname}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>이메일</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                role="email"
                disabled={true}
                value={accountInfo.lastname}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>생년월일</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                role="birthdate"
                type="date"
                value={accountInfo.birthdate}
                onChange={e => {
                  console.log(e.target.value);
                  setAccountInfo(prev => ({
                    ...prev,
                    birthdate: e.target.value,
                  }));
                }}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>비밀번호</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.FormInnerButton
                role="changePassword"
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
