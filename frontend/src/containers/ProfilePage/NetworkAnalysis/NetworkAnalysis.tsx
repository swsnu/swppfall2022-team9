import React, { useEffect } from "react";
import { TwoChonInfo } from "types/friend.types";

interface Props {
  profileUserFriends: Array<TwoChonInfo> | undefined;
}

const NetworkAnalysis: React.FC<Props> = ({ profileUserFriends }) => {
  useEffect(() => {}, []);
  return <div>NetworkAnalysis</div>;
};

export default NetworkAnalysis;
