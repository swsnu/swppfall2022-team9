import { PostSignUpDto } from "server/dto/users/users.dto";
import useAlert from "hooks/useAlert";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import {
  checkEmailUnique,
  checkUsernameUnique,
  postSignUp,
} from "store/slices/users";
import * as S from "./styles";
import { emailRegex } from "utils/email";

interface Props {}

interface SignUpInfo extends PostSignUpDto {
  passwordConfirm: string;
}

export enum HelperText {
  NO_ERROR = "",
  REQUIRED = "필수 정보입니다.",
  UNVERIFIED_EMAIL = "이메일 중복 확인을 진행해주세요.",
  INVALID_EMAIL = "잘못된 이메일 형식입니다.",
  UNVERIFIED_USERNAME = "아이디 중복 확인을 진행해주세요.",
  DIFFERENT_PASSWORD = "비밀번호가 일치하지 않습니다.",
}

const SignUpPage: React.FC<Props> = () => {
  const alert = useAlert();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [signUpInfo, setSignUpInfo] = useState<SignUpInfo>({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);

  const [isEmailClicked, setIsEmailClicked] = useState<boolean>(false);
  const [isEmailChanged, setIsEmailChanged] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isEmailUnique, setIsEmailUnique] = useState<boolean>(false);

  const [isUsernameClicked, setIsUsernameClicked] = useState<boolean>(false);
  const [isUsernameChanged, setIsUsernameChanged] = useState<boolean>(false);
  const [isUsernameUnique, setIsUsernameUnique] = useState<boolean>(false);

  const maxNameLength = 50;
  const maxEmailLength = 50;
  const maxNicknameLength = 50;
  const maxPasswordLength = 20;

  const checkFormValidity = (info: SignUpInfo): boolean => {
    if (info.password != info.passwordConfirm) return false;

    let isFormValid = true;
    const infoKeys = Object.keys(info) as Array<keyof SignUpInfo>;
    infoKeys.forEach(key => {
      if (!info[key]) {
        isFormValid = false;
        return;
      }
    });
    return isFormValid && isEmailUnique && isUsernameUnique;
  };

  const checkEmailValidity = (email: string) => {
    return emailRegex.test(email);
  };

  const onSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setIsSubmitClicked(true);
      const isFormValid = checkFormValidity(signUpInfo);

      if (isFormValid) {
        alert.open({
          message: "처리 중입니다...",
          buttons: [],
        });
        try {
          await dispatch(
            postSignUp({
              firstname: signUpInfo.firstname,
              lastname: signUpInfo.lastname,
              email: signUpInfo.email,
              username: signUpInfo.username,
              password: signUpInfo.password,
            }),
          ).unwrap();
          alert.open({
            message: `${signUpInfo.email}로 인증 메일을 발송하였습니다.`,
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
          alert.open({ message: "서버 오류: 회원가입에 실패했습니다!" });
        }
      }
    },
    [alert, signUpInfo],
  );

  const onClickCheckEmail = async () => {
    setIsEmailClicked(true);
    try {
      await dispatch(checkEmailUnique(signUpInfo.email)).unwrap();
      alert.open({ message: "사용 가능한 이메일입니다." });
      setIsEmailUnique(true);
    } catch (err) {
      alert.open({ message: "이미 사용 중인 이메일입니다." });
    }
  };

  const onClickCheckUsername = async () => {
    setIsUsernameClicked(true);
    try {
      await dispatch(checkUsernameUnique(signUpInfo.username)).unwrap();
      alert.open({ message: "사용 가능한 아이디입니다." });
      setIsUsernameUnique(true);
    } catch (err) {
      alert.open({ message: "이미 사용 중인 아이디입니다." });
    }
  };

  return (
    <S.Container>
      <S.FormContainer>
        <S.Header>
          <S.HeaderText>회원가입</S.HeaderText>
        </S.Header>
        <S.Form onSubmit={onSubmit}>
          <S.Label>
            <S.LabelText>이메일</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="email"
                autoComplete="on"
                maxLength={maxEmailLength}
                onChange={e => {
                  setIsEmailChanged(true);
                  setSignUpInfo(prev => ({ ...prev, email: e.target.value }));
                  setIsEmailUnique(false);
                  setIsEmailValid(checkEmailValidity(e.target.value));
                }}
              />
              {(isSubmitClicked || isEmailClicked || isEmailChanged) && (
                <S.InputHelper>
                  {!signUpInfo.email
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
            <S.LabelText>아이디</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="username"
                maxLength={maxNicknameLength}
                onChange={e => {
                  setIsUsernameChanged(true);
                  setSignUpInfo(prev => ({
                    ...prev,
                    username: e.target.value,
                  }));
                  setIsUsernameUnique(false);
                }}
              />
              {(isSubmitClicked || isUsernameClicked || isUsernameChanged) && (
                <S.InputHelper>
                  {!signUpInfo.username
                    ? HelperText.REQUIRED
                    : isUsernameUnique
                    ? HelperText.NO_ERROR
                    : HelperText.UNVERIFIED_USERNAME}
                </S.InputHelper>
              )}
            </S.InputContainer>
            <S.UniqueCheckButton
              disabled={signUpInfo.username ? false : true}
              type="button"
              onClick={onClickCheckUsername}
            >
              중복 확인
            </S.UniqueCheckButton>
          </S.Label>
          <S.Label>
            <S.LabelText>성</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="lastname"
                autoComplete="on"
                maxLength={maxNameLength}
                onChange={e => {
                  setSignUpInfo(prev => ({
                    ...prev,
                    lastname: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {signUpInfo.lastname
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
                type="text"
                name="firstname"
                autoComplete="on"
                maxLength={maxNameLength}
                onChange={e => {
                  setSignUpInfo(prev => ({
                    ...prev,
                    firstname: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {signUpInfo.firstname
                    ? HelperText.NO_ERROR
                    : HelperText.REQUIRED}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
          <S.Label>
            <S.LabelText>비밀번호</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="password"
                name="password"
                maxLength={maxPasswordLength}
                onChange={e => {
                  setSignUpInfo(prev => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {signUpInfo.password
                    ? HelperText.NO_ERROR
                    : HelperText.REQUIRED}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
          <S.Label>
            <S.LabelText>비밀번호 확인</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="password"
                name="password-confirm"
                maxLength={maxPasswordLength}
                onChange={e => {
                  setSignUpInfo(prev => ({
                    ...prev,
                    passwordConfirm: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {signUpInfo.password == signUpInfo.passwordConfirm
                    ? signUpInfo.passwordConfirm
                      ? HelperText.NO_ERROR
                      : HelperText.REQUIRED
                    : HelperText.DIFFERENT_PASSWORD}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
          <S.Submit type="submit">가입하기</S.Submit>
        </S.Form>
      </S.FormContainer>
    </S.Container>
  );
};

export default SignUpPage;
