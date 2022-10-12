import AuthWrapper from "containers/AuthWrapper/AuthWrapper";
import React from "react";

interface Props {}

const HomePage: React.FC<Props> = () => {
  return (
    <AuthWrapper>
      <div>HomePage</div>
    </AuthWrapper>
  );
};

export default HomePage;
