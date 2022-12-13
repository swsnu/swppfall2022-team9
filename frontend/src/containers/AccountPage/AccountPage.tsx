import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { friendRequestActions } from "store/slices/friendRequests";
import { getSignOut } from "store/slices/users";
import { putAccount } from "store/slices/account";
import { checkEmailUnique } from "store/slices/users";
import * as Common from "styles/common.form.styles";
import * as S from "../SignUpPage/styles";
import useAlert from "hooks/useAlert";
import { emailRegex } from "utils/email";

interface LoginError {
  status: number;
}

export enum HelperText {
  NO_ERROR = "",
  REQUIRED = "필수 정보입니다.",
  UNVERIFIED_EMAIL = "이메일 중복 확인을 진행해주세요.",
  INVALID_EMAIL = "잘못된 이메일 형식입니다.",
}

interface PutAccountInfo {
  firstname: string;
  lastname: string;
  email: string;
}

const AccountPage: React.FC = () => {
  const alert = useAlert();
  const [accountInfo, setAccountInfo] = useState<PutAccountInfo>({
    firstname: "",
    lastname: "",
    email: "",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;

  const maxNameLength = 50;
  const maxEmailLength = 50;

  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);

  const [isEmailClicked, setIsEmailClicked] = useState<boolean>(false);
  const [isEmailChanged, setIsEmailChanged] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isEmailUnique, setIsEmailUnique] = useState<boolean>(false);

  const checkFormValidity = (info: PutAccountInfo): boolean => {
    let isFormValid = true;
    const infoKeys = Object.keys(info) as Array<keyof PutAccountInfo>;
    infoKeys.forEach(key => {
      if (!info[key]) {
        isFormValid = false;
        return;
      }
    });
    return isFormValid && isEmailUnique;
  };

  const checkEmailValidity = (email: string) => {
    return emailRegex.test(email);
  };

  const onClickChangePassword = () => {
    navigate("/account/password");
  };
  const onClickLogout = async () => {
    await dispatch(getSignOut());
    dispatch(friendRequestActions.resetFriendRequests());
    navigate("/");
  };

  const onClickSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitClicked(true);
    const isFormValid = checkFormValidity(accountInfo);

    if (isFormValid) {
      alert.open({
        message: "처리 중입니다...",
        buttons: [],
      });
      try {
        await dispatch(
          putAccount({
            lastname: accountInfo.lastname,
            firstname: accountInfo.firstname,
            email: accountInfo.email,
          }),
        ).unwrap();
        alert.open({
          message: "계정 정보가 업데이트 되었습니다.",
          buttons: [
            {
              label: "확인",
              onClick: () => {
                alert.close();
                navigate("/");
              },
            },
          ],
        });
      } catch (err) {
        alert.close();
        const loginError = err as LoginError;
        if (loginError.status === 400) {
          alert.open({ message: "이미 사용중인 이메일입니다." });
        } else {
          alert.open({ message: "계정 정보 업데이트에 실패하였습니다." });
        }
      }
    }
  };

  const onClickCheckEmail = async () => {
    setIsEmailClicked(true);
    try {
      await dispatch(checkEmailUnique(accountInfo.email)).unwrap();
      alert.open({ message: "사용 가능한 이메일입니다." });
      setIsEmailUnique(true);
    } catch (err) {
      alert.open({ message: "이미 사용 중인 이메일입니다." });
    }
  };

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

  useEffect(() => {
    if (currentUser) {
      setAccountInfo({
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        email: currentUser.email,
      });
    }
  }, [currentUser]);

  return (
    <S.Container>
      <S.FormContainer>
        <S.Header>
          <S.HeaderText>개인 정보 수정</S.HeaderText>
        </S.Header>
        <S.Form role="submit" onSubmit={onClickSubmit}>
          <S.Label>
            <S.LabelText>성</S.LabelText>
            <S.InputContainer>
              <S.Input
                maxLength={maxNameLength}
                role="lastname"
                value={accountInfo.lastname}
                onChange={e => {
                  setAccountInfo(prev => ({
                    ...prev,
                    lastname: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {accountInfo.lastname
                    ? HelperText.NO_ERROR
                    : HelperText.REQUIRED}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
          <S.Label>
            <S.LabelText>이름</S.LabelText>
            <S.InputContainer>
              <S.Input
                maxLength={maxNameLength}
                role="firstname"
                value={accountInfo.firstname}
                onChange={e => {
                  setAccountInfo(prev => ({
                    ...prev,
                    firstname: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {accountInfo.firstname
                    ? HelperText.NO_ERROR
                    : HelperText.REQUIRED}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
          <S.Label>
            <S.LabelText>이메일</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="email"
                role="email"
                autoComplete="on"
                value={accountInfo.email}
                maxLength={maxEmailLength}
                onChange={e => {
                  setIsEmailChanged(true);
                  setAccountInfo(prev => ({ ...prev, email: e.target.value }));
                  setIsEmailUnique(false);
                  setIsEmailValid(checkEmailValidity(e.target.value));
                }}
              />
              {(isSubmitClicked || isEmailClicked || isEmailChanged) && (
                <S.InputHelper>
                  {!accountInfo.email
                    ? HelperText.REQUIRED
                    : isEmailValid
                    ? isEmailUnique
                      ? HelperText.NO_ERROR
                      : HelperText.UNVERIFIED_EMAIL
                    : HelperText.INVALID_EMAIL}
                </S.InputHelper>
              )}
            </S.InputContainer>
            <S.UniqueCheckButton
              disabled={isEmailValid ? false : true}
              type="button"
              onClick={onClickCheckEmail}
            >
              중복 확인
            </S.UniqueCheckButton>
          </S.Label>
          <S.Label>
            <S.InputContainer>
              <Common.FormInnerButton
                role="changePassword"
                style={{ fontWeight: "bold" }}
                onClick={onClickChangePassword}
              >
                비밀번호 변경하기
              </Common.FormInnerButton>
            </S.InputContainer>
          </S.Label>
          <S.Submit backgroundColor="#D9D9D9" onClick={onClickLogout}>
            로그아웃
          </S.Submit>
          {/* <S.Submit
            backgroundColor="transparent"
            style={{
              fontSize: 12,
              opacity: 0.6,
              fontWeight: "lighter",
            }}
            onClick={onClickDeleteAccount}
          >
            계정삭제
          </S.Submit> */}
        </S.Form>
      </S.FormContainer>
    </S.Container>
  );
};

export default AccountPage;
