import { PostSignUpDto } from "server/dto/users/users.dto";
import useAlert from "hooks/useAlert";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { postSignUp } from "store/slices/users";
import * as S from "../../styles/common.form.styles";

interface Props {}

interface SignUpInfo extends PostSignUpDto {
  passwordConfirm: string;
}

export enum HelperText {
  NO_ERROR = "",
  REQUIRED = "필수 정보입니다.",
  DIFFERENT_PASSWORD = "비밀번호가 일치하지 않습니다.",
}

const SignUpPage: React.FC<Props> = () => {
  const alert = useAlert();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const currentUser = useAppSelector(state => state.users.currentUser);
  const [signUpInfo, setSignUpInfo] = useState<SignUpInfo>({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
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
    return isFormValid;
  };

  const onSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setIsSubmitClicked(true);
      const isFormValid = checkFormValidity(signUpInfo);

      if (isFormValid) {
        const result = await dispatch(
          postSignUp({
            firstname: signUpInfo.firstname,
            lastname: signUpInfo.lastname,
            email: signUpInfo.email,
            username: signUpInfo.username,
            password: signUpInfo.password,
          }),
        );
        if (result.type === `${postSignUp.typePrefix}/fulfilled`) {
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
        } else {
          alert.open({ message: "서버 오류: 회원가입에 실패했습니다!" });
        }
      }
    },
    [alert, signUpInfo],
  );

  return (
    <S.Container>
      <S.FormContainer>
        <S.GuideContainer>
          <S.Title>회원가입</S.Title>
        </S.GuideContainer>
        <S.Form onSubmit={onSubmit}>
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
            <S.LabelText>이메일</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="email"
                autoComplete="on"
                maxLength={maxEmailLength}
                onChange={e => {
                  setSignUpInfo(prev => ({ ...prev, email: e.target.value }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {signUpInfo.email ? HelperText.NO_ERROR : HelperText.REQUIRED}
                </S.InputHelper>
              )}
            </S.InputContainer>
          </S.Label>
          <S.Label>
            <S.LabelText>아이디</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="username"
                maxLength={maxNicknameLength}
                onChange={e => {
                  setSignUpInfo(prev => ({
                    ...prev,
                    username: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {signUpInfo.username
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
          <S.Submit type="submit" onSubmit={onSubmit}>
            가입하기
          </S.Submit>
        </S.Form>
      </S.FormContainer>
    </S.Container>
  );
};

export default SignUpPage;
