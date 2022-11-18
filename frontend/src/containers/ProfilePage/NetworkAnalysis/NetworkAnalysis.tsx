import React, { useEffect, useState } from "react";
import { TwoChonInfo } from "types/friend.types";

interface Props {
  profileUserFriends: Array<TwoChonInfo> | undefined;
}

const NetworkAnalysis: React.FC<Props> = ({ profileUserFriends }) => {
  const [networkMap, setNetworkMap] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    if (profileUserFriends) {
      const tempNetworkMap = new Map();
      setNetworkMap(tempNetworkMap);
    }
  }, []);
  return <div>NetworkAnalysis</div>;
};

export default NetworkAnalysis;
