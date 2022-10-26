import { PostSignUpDto } from "dto/users/users.dto";
import useAlert from "hooks/useAlert";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
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
  const currentUser = useAppSelector(state => state.users.currentUser);
  const [signUpInfo, setSignUpInfo] = useState<SignUpInfo>({
    name: "",
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [signUpHelper, setSignUpHelper] = useState<SignUpInfo>({
    name: HelperText.NO_ERROR,
    email: HelperText.NO_ERROR,
    nickname: HelperText.NO_ERROR,
    password: HelperText.NO_ERROR,
    passwordConfirm: HelperText.NO_ERROR,
  });
  const maxNameLength = 50;
  const maxEmailLength = 50;
  const maxNicknameLength = 50;
  const maxPasswordLength = 20;
  let isFormValid = false;

  const onSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      const signUpInfoKeys = Object.keys(signUpInfo) as Array<keyof SignUpInfo>;
      signUpInfoKeys.forEach(field => {
        if (!signUpInfo[field]) {
          setSignUpHelper(prev => ({ ...prev, [field]: HelperText.REQUIRED }));
        }
      });

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
    [alert, signUpInfo, signUpHelper],
  );

  useEffect(() => {
    const signUpInfoKeys = Object.keys(signUpInfo) as Array<keyof SignUpInfo>;
    isFormValid = true;
    signUpInfoKeys.forEach(field => {
      if (signUpHelper[field] || !signUpInfo[field]) {
        isFormValid = false;
        return;
      }
    });
  }, [signUpHelper]);

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
                  setSignUpHelper(prev => {
                    return e.target.value
                      ? { ...prev, name: HelperText.NO_ERROR }
                      : { ...prev, name: HelperText.REQUIRED };
                  });
                }}
              />
              <S.InputHelper>{signUpHelper.name}</S.InputHelper>
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
                  setSignUpHelper(prev => {
                    return e.target.value
                      ? { ...prev, email: HelperText.NO_ERROR }
                      : { ...prev, email: HelperText.REQUIRED };
                  });
                }}
              />
              <S.InputHelper>{signUpHelper.email}</S.InputHelper>
            </S.InputContainer>
          </S.Label>
          <S.Label>
            <S.LabelText>닉네임</S.LabelText>
            <S.InputContainer>
              <S.Input
                type="text"
                name="nickname"
                autoComplete="on"
                maxLength={maxNicknameLength}
                onChange={e => {
                  setSignUpInfo(prev => ({
                    ...prev,
                    nickname: e.target.value,
                  }));
                  setSignUpHelper(prev => {
                    return e.target.value
                      ? { ...prev, nickname: HelperText.NO_ERROR }
                      : { ...prev, nickname: HelperText.REQUIRED };
                  });
                }}
              />
              <S.InputHelper>{signUpHelper.nickname}</S.InputHelper>
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
                  setSignUpHelper(prev => {
                    return e.target.value
                      ? { ...prev, password: HelperText.NO_ERROR }
                      : { ...prev, password: HelperText.REQUIRED };
                  });
                  setSignUpHelper(prev => {
                    return signUpInfo.passwordConfirm == e.target.value
                      ? { ...prev, passwordConfirm: HelperText.NO_ERROR }
                      : {
                          ...prev,
                          passwordConfirm: HelperText.DIFFERENT_PASSWORD,
                        };
                  });
                }}
              />
              <S.InputHelper>{signUpHelper.password}</S.InputHelper>
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
                  setSignUpHelper(prev => {
                    return signUpInfo.password == e.target.value
                      ? { ...prev, passwordConfirm: HelperText.NO_ERROR }
                      : {
                          ...prev,
                          passwordConfirm: HelperText.DIFFERENT_PASSWORD,
                        };
                  });
                }}
              />
              <S.InputHelper>{signUpHelper.passwordConfirm}</S.InputHelper>
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
