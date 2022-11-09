import React, { useEffect, useRef } from "react";
import { useAppSelector } from "store/hooks";
import useCanvas from "./hooks/useCanvas";

import * as S from "./styles";

interface Props {}

const Graph: React.FC<Props> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const canvas = useCanvas({ divRef: divRef, canvasRef: canvasRef });
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;
  const friendList = users.friendList;
  useEffect(() => {
    if (currentUser && canvas) {
      canvas.setCurrentUserNode(currentUser);
      if (friendList.length > 0) {
        canvas.setOneChonNodes(friendList);
      }
      canvas.render();
    }
  }, [currentUser, friendList, canvas]);

  return (
    <S.CanvasContainer ref={divRef}>
      <canvas ref={canvasRef} />
    </S.CanvasContainer>
  );
};

export default Graph;
