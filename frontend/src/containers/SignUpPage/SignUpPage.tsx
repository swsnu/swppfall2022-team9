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

enum HelperText {
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
    name: "",
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const maxNameLength = 50;
  const maxEmailLength = 50;
  const maxNicknameLength = 50;
  const maxPasswordLength = 20;

  const checkFormValidity = (info: SignUpInfo): boolean => {
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
        try {
          const result = await dispatch(
            postSignUp({
              name: signUpInfo.name,
              email: signUpInfo.email,
              nickname: signUpInfo.nickname,
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
          }
        } catch (err) {
          alert.open({ message: "서버 오류: 회원가입에 실패했습니다!" });
          console.log(err);
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
            <S.LabelText>이름</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="name"
                autoComplete="on"
                maxLength={maxNameLength}
                onChange={e => {
                  setSignUpInfo(prev => ({ ...prev, name: e.target.value }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {signUpInfo.name ? HelperText.NO_ERROR : HelperText.REQUIRED}
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
            <S.LabelText>닉네임</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="nickname"
                maxLength={maxNicknameLength}
                onChange={e => {
                  setSignUpInfo(prev => ({
                    ...prev,
                    nickname: e.target.value,
                  }));
                }}
              />
              {isSubmitClicked && (
                <S.InputHelper>
                  {signUpInfo.nickname
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
