import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { verifyRegisterToken } from "store/slices/users";
import * as S from "./styles";

enum VerifyRegisterTokenMessage {
  LOADING = "잠시만 기다려주세요...",
  SUCCESS = "이메일 인증에 성공했습니다.",
  FAIL = "인증 코드가 올바르지 않거나 만료되었습니다. 로그인해서 인증 코드를 다시 받으세요.",
}
const VerifyRegisterPage = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [verifyStatus, setVerifyStatus] = useState<VerifyRegisterTokenMessage>(
    VerifyRegisterTokenMessage.LOADING,
  );

  const goToLogin = useCallback(() => {
    navigate("/");
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(verifyRegisterToken(token))
        .unwrap()
        .then(() => {
          setVerifyStatus(VerifyRegisterTokenMessage.SUCCESS);
        })
        .catch(() => {
          setVerifyStatus(VerifyRegisterTokenMessage.FAIL);
        });
    }
  }, [token]);

  return (
    <S.Container>
      <S.ContentContainer>
        <S.Message>{verifyStatus}</S.Message>
        {verifyStatus !== VerifyRegisterTokenMessage.LOADING && (
          <S.ButtonsContainer>
            <S.Button onClick={goToLogin}>로그인 페이지로 이동</S.Button>
          </S.ButtonsContainer>
        )}
      </S.ContentContainer>
    </S.Container>
  );
};

export default VerifyRegisterPage;
