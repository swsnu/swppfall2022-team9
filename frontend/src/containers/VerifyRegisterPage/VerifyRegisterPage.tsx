import SingleMessagePage from "components/SingleMessagePage/SingleMessagePage";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { verifyRegisterToken } from "store/slices/users";

export enum VerifyRegisterTokenMessage {
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

  const goToHomePage = useCallback(() => {
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
    <SingleMessagePage
      message={verifyStatus}
      isButtonVisible={verifyStatus !== VerifyRegisterTokenMessage.LOADING}
      onClickButton={goToHomePage}
      buttonText="홈페이지로 이동"
    />
  );
};

export default VerifyRegisterPage;
