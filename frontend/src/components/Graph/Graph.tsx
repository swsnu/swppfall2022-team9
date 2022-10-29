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
  useEffect(() => {
    if (currentUser && canvas) {
      canvas.setCurrentUserNode(currentUser);
      canvas.render();
    }
  }, [currentUser, canvas]);

  return (
    <S.CanvasContainer ref={divRef}>
      <canvas ref={canvasRef} />
    </S.CanvasContainer>
  );
};

export default Graph;
