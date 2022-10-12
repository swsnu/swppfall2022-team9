import AuthWrapper from "containers/AuthWrapper/AuthWrapper";
import React from "react";

interface Props {}

const ChatListPage: React.FC<Props> = () => {
  return (
    <AuthWrapper>
      <div>ChatListPage</div>
    </AuthWrapper>
  );
};

export default ChatListPage;
