import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { friendRequestActions } from "store/slices/friendRequests";
import { getSignOut } from "store/slices/users";
import { getAccount, putAccount } from "store/slices/account";
import { checkEmailUnique } from "store/slices/users";
import * as S from "./styles";
import useAlert from "hooks/useAlert";
import { checkEmailValidity } from "utils/email";
import { HelperText } from "styles/common.form.styles";
import { searchActions } from "store/slices/search";
import { profileActions } from "store/slices/profile";
import { canvasActions } from "store/slices/canvas";

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
  const account = useAppSelector(state => state.account);
  const currentUser = users.currentUser;
  const currentAccountInfo = account.currentAccountInfo;

  const maxNameLength = 50;
  const maxEmailLength = 50;

  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);

  const [isEmailClicked, setIsEmailClicked] = useState<boolean>(false);
  const [isEmailChanged, setIsEmailChanged] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isEmailUnique, setIsEmailUnique] = useState<boolean>(true);
  const [isEmailIdentical, setIsEmailIdentical] = useState<boolean>(true);
  const [originalEmail, setOriginalEmail] = useState<string>("");

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

  const onClickChangePassword = () => {
    navigate("/account/password");
  };

  const onClickLogout = async () => {
    await dispatch(getSignOut());
    dispatch(friendRequestActions.resetFriendRequests());
    dispatch(searchActions.SearchModeOff());
    dispatch(profileActions.setPreviewProfile(null));
    dispatch(canvasActions.setOneChonIdToExpandNetwork(null));
    dispatch(canvasActions.setIsPanZoomed(false));
    navigate("/");
  };

  const onClickSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitClicked(true);
    setIsEmailValid(checkEmailValidity(accountInfo.email));
    const isFormValid = checkFormValidity(accountInfo);

    if (isFormValid) {
      alert.open({
        message: "?????? ????????????...",
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
        if (accountInfo.email === originalEmail) {
          alert.open({
            message: "?????? ????????? ?????????????????????.",
            buttons: [
              {
                label: "??????",
                onClick: () => {
                  alert.close();
                  navigate("/");
                },
              },
            ],
          });
        } else {
          await dispatch(getSignOut());
          alert.open({
            message:
              "???????????? ????????????????????? ????????? ??? ????????? ???????????? ????????????.",
            buttons: [
              {
                label: "??????",
                onClick: () => {
                  alert.close();
                  navigate("/");
                },
              },
            ],
          });
        }
      } catch (err) {
        alert.close();
        alert.open({ message: "?????? ?????? ????????? ?????????????????????." });
      }
    }
  };

  const onClickCheckEmail = async () => {
    setIsEmailClicked(true);
    try {
      await dispatch(checkEmailUnique(accountInfo.email)).unwrap();
      alert.open({ message: "?????? ????????? ??????????????????." });
      setIsEmailUnique(true);
    } catch (err) {
      alert.open({ message: "?????? ?????? ?????? ??????????????????." });
    }
  };

  // // TODO: delete account
  // const onClickDeleteAccount = () => {
  //   alert.open({
  //     message: "?????? ????????? ????????????????",
  //     buttons: [
  //       {
  //         label: "???",
  //         onClick: () => {
  //           //TODO dispatch
  //         },
  //       },
  //       {
  //         label: "?????????",
  //         onClick: () => {
  //           alert.close();
  //         },
  //       },
  //     ],
  //   });
  // };

  const getAccountInfo = async () => {
    try {
      await dispatch(getAccount()).unwrap();
    } catch (err) {
      alert.open({
        message: "?????? ?????? ????????? ??????????????????.",
        buttons: [
          {
            label: "??????",
            onClick: () => {
              alert.close();
              navigate("/");
            },
          },
        ],
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      getAccountInfo();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentAccountInfo) {
      setAccountInfo({
        firstname: currentAccountInfo.firstname,
        lastname: currentAccountInfo.lastname,
        email: currentAccountInfo.email,
      });
      setOriginalEmail(currentAccountInfo.email);
    }
  }, [currentAccountInfo]);

  return (
    <S.Container>
      <S.FormContainer>
        <S.Header>
          <S.HeaderText>?????? ?????? ??????</S.HeaderText>
        </S.Header>
        <S.Form role="submit">
          <S.Label>
            <S.LabelText>???</S.LabelText>
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
            <S.LabelText>??????</S.LabelText>
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
            <S.LabelText>?????????</S.LabelText>
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
                  setIsEmailUnique(e.target.value === originalEmail);
                  setIsEmailValid(checkEmailValidity(e.target.value));
                  setIsEmailIdentical(e.target.value === originalEmail);
                }}
              />
              {(isSubmitClicked || isEmailClicked || isEmailChanged) && (
                <S.InputHelper>
                  {!isEmailIdentical &&
                    (!accountInfo.email
                      ? HelperText.REQUIRED
                      : isEmailValid
                      ? isEmailUnique
                        ? HelperText.NO_ERROR
                        : HelperText.UNVERIFIED_EMAIL
                      : HelperText.INVALID_EMAIL)}
                </S.InputHelper>
              )}
            </S.InputContainer>
            <S.UniqueCheckButton
              disabled={isEmailIdentical || !isEmailValid ? true : false}
              type="button"
              onClick={onClickCheckEmail}
            >
              ?????? ??????
            </S.UniqueCheckButton>
          </S.Label>
          <S.Submit onClick={onClickSubmit}>????????????</S.Submit>
          {/* <S.Submit
            backgroundColor="transparent"
            style={{
              fontSize: 12,
              opacity: 0.6,
              fontWeight: "lighter",
            }}
            onClick={onClickDeleteAccount}
          >
            ????????????
          </S.Submit> */}
        </S.Form>
        <S.FormOuterButtonContainer>
          <S.FormOuterButton
            role="changePassword"
            onClick={onClickChangePassword}
          >
            ???????????? ??????
          </S.FormOuterButton>
          <S.FormOuterButton backgroundColor="#D9D9D9" onClick={onClickLogout}>
            ????????????
          </S.FormOuterButton>
        </S.FormOuterButtonContainer>
      </S.FormContainer>
    </S.Container>
  );
};

export default AccountPage;
