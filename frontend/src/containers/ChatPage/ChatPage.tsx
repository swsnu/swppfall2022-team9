import AuthWrapper from "containers/AuthWrapper/AuthWrapper";
import React from "react";

interface Props {}

const ChatPage: React.FC<Props> = () => {
  return (
    <AuthWrapper>
      <div>ChatPage</div>
    </AuthWrapper>
  );
};

export default ChatPage;
