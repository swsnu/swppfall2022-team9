import AuthWrapper from "containers/AuthWrapper/AuthWrapper";
import React from "react";

interface Props {}

const SearchPage: React.FC<Props> = () => {
  return (
    <AuthWrapper>
      <div>SearchPage</div>
    </AuthWrapper>
  );
};

export default SearchPage;
