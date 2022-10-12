import AuthWrapper from "containers/AuthWrapper/AuthWrapper";
import React from "react";

interface Props {}

const ChangeProfilePage: React.FC<Props> = () => {
  return (
    <AuthWrapper>
      <div>ChangeProfilePage</div>
    </AuthWrapper>
  );
};

export default ChangeProfilePage;
