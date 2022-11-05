import React, { useEffect, useRef } from "react";
import { useAppSelector } from "store/hooks";
import useCanvas from "./hooks/useCanvas";

import * as S from "./styles";

interface Props {}

const Graph: React.FC<Props> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const canvas = useCanvas({ divRef: divRef, canvasRef: canvasRef });
  const currentUser = useAppSelector(state => state.users.currentUser);
  const chonList = useAppSelector(state => state.users.chonList);
  useEffect(() => {
    if (currentUser && canvas) {
      canvas.setCurrentUserNode(currentUser);
      if (chonList) {
        canvas.setOneChonNodes(chonList);
      }
      canvas.render();
    }
  }, [currentUser, chonList, canvas]);

  return (
    <S.CanvasContainer ref={divRef}>
      <canvas ref={canvasRef} />
    </S.CanvasContainer>
  );
};

export default Graph;
