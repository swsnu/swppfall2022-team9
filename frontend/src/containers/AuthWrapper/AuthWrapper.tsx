import LoginModal from "containers/LoginModal/LoginModal";
import Portal from "containers/Portal/Portal";
import React from "react";
import { useAppSelector } from "../../store/hooks";

interface Props {
  children: React.ReactNode;
}

export enum LoginModalMessage {
  NOT_AUTHENTICATED = "로그인이 필요한 서비스입니다",
}

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const currentUser = useAppSelector(state => state.users.currentUser);

  return (
    <>
      {!currentUser && (
        <Portal>
          <LoginModal />
        </Portal>
      )}
      {children}
    </>
  );
};

export default AuthWrapper;
