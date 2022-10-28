import LoginModal from "containers/LoginModal/LoginModal";
import Portal from "containers/Portal/Portal";
import React from "react";
import { useAppSelector } from "../../store/hooks";

interface Props {
  children: React.ReactNode;
}

export enum LoginModalMessage {
  SESSION_EXPIRED = "로그인 세션이 만료되었으니 다시 로그인해주시기 바랍니다 (재로그인하면 현재 보고 계신 창으로 다시 돌아옵니다)",
  NOT_AUTHENTICATED = "로그인이 필요한 서비스입니다",
}

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const currentUser = useAppSelector(state => state.users.currentUser);

  return (
    <>
      {!currentUser && (
        <Portal>
          <LoginModal
            message={
              currentUser
                ? LoginModalMessage.SESSION_EXPIRED
                : LoginModalMessage.NOT_AUTHENTICATED
            }
          />
        </Portal>
      )}
      {children}
    </>
  );
};

export default AuthWrapper;
