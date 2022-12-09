import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { friendRequestActions } from "store/slices/friendRequests";
import { getSignOut } from "store/slices/users";
import { putAccount } from "store/slices/account";
import * as FormStyles from "styles/common.form.styles";
import useAlert from "hooks/useAlert";

const AccountPage: React.FC = () => {
  const alert = useAlert();
  const [accountInfo, setAccountInfo] = useState<{
    firstname: string;
    lastname: string;
    email: string;
  }>({
    firstname: "",
    lastname: "",
    email: "",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;
  // const alert = useAlert();

  // TODO: connect with redux (fill in the blank inputs)

  const onClickChangePassword = () => {
    navigate("/account/password");
  };
  const onClickLogout = async () => {
    await dispatch(getSignOut());
    dispatch(friendRequestActions.resetFriendRequests());
    navigate("/");
  };
  
  // TODO: add casess
  const onClickSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(putAccount({
        lastname: accountInfo.lastname,
        firstname: accountInfo.firstname,
        email: accountInfo.email,
      }))
      alert.open({
        message: "계정 정보가 업데이트 되었습니다."
      })
    } catch (err) {
      alert.open({ message: "계정 정보 업데이트에 실패하였습니다."})
    }
  }

  // // TODO: delete account
  // const onClickDeleteAccount = () => {
  //   alert.open({
  //     message: "계정 삭제를 진행할까요?",
  //     buttons: [
  //       {
  //         label: "네",
  //         onClick: () => {
  //           //TODO dispatch
  //         },
  //       },
  //       {
  //         label: "아니오",
  //         onClick: () => {
  //           alert.close();
  //         },
  //       },
  //     ],
  //   });
  // };

  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>개인 정보</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form
          role="submit"
          onSubmit={onClickSubmit}
        >
          <FormStyles.Label>
            <FormStyles.LabelText>성</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                role="lastname"
                value={currentUser ? currentUser.lastname : ""}
                onChange={e => {
                  setAccountInfo(prev => ({
                    ...prev,
                    lastname: e.target.value,
                  }));
                }}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>이름</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                role="firstname"
                value={currentUser ? currentUser.firstname : ""}
                onChange={e => {
                  setAccountInfo(prev => ({
                    ...prev,
                    firstname: e.target.value,
                  }));
                }}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.LabelText>이메일</FormStyles.LabelText>
            <FormStyles.InputContainer>
              <FormStyles.Input
                role="email"
                value={currentUser ? currentUser.email : ""}
                onChange={e => {
                  setAccountInfo(prev => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          {/* <FormStyles.Label>
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
          </FormStyles.Label> */}
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
          {/* <FormStyles.Submit
            backgroundColor="transparent"
            style={{
              fontSize: 12,
              opacity: 0.6,
              fontWeight: "lighter",
            }}
            onClick={onClickDeleteAccount}
          >
            계정삭제
          </FormStyles.Submit> */}
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default AccountPage;
