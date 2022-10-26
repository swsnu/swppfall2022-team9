import { PostSignUpDto } from "dto/users/users.dto";
import useAlert from "hooks/useAlert";
import React, { useCallback, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { postSignUp } from "store/slices/users";
import * as S from "../../styles/common.form.styles";

interface Props {}

interface SignUpInfo extends PostSignUpDto {
  passwordConfirm: string;
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
    name: "필수 정보입니다.",
    email: "필수 정보입니다.",
    nickname: "필수 정보입니다.",
    password: "필수 정보입니다.",
    passwordConfirm: "필수 정보입니다.",
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
          setSignUpHelper(prev => ({ ...prev, [field]: "필수 정보입니다." }));
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
      if (signUpHelper[field]) {
        isFormValid = false;
      }
    });
  }, [signUpHelper]);

  return (
    <S.Container>
      <S.FormContainer>
        <S.CloseButtonContainer>
          <IoCloseOutline
            style={{
              cursor: "pointer",
            }}
            color="#D9D9D9"
            size="100%"
            onClick={e => {
              e.stopPropagation();
              navigate("/");
            }}
          />
        </S.CloseButtonContainer>
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
                      ? { ...prev, name: "" }
                      : { ...prev, name: "필수 정보입니다." };
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
                      ? { ...prev, email: "" }
                      : { ...prev, email: "필수 정보입니다." };
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
                      ? { ...prev, nickname: "" }
                      : { ...prev, nickname: "필수 정보입니다." };
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
                      ? { ...prev, password: "" }
                      : { ...prev, password: "필수 정보입니다." };
                  });
                  setSignUpHelper(prev => {
                    return signUpInfo.passwordConfirm == e.target.value
                      ? { ...prev, passwordConfirm: "" }
                      : {
                          ...prev,
                          passwordConfirm: "비밀번호가 일치하지 않습니다.",
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
                      ? { ...prev, passwordConfirm: "" }
                      : {
                          ...prev,
                          passwordConfirm: "비밀번호가 일치하지 않습니다.",
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
