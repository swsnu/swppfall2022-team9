import AuthWrapper from "containers/AuthWrapper/AuthWrapper";
import React from "react";

interface Props {}

const ProfilePage: React.FC<Props> = () => {
  return (
    <AuthWrapper>
      <div>ProfilePage</div>
    </AuthWrapper>
  );
};

export default ProfilePage;
