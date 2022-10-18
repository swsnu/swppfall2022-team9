import React, { useEffect, useRef } from "react";
import { useAppSelector } from "store/hooks";
import { Canvas } from "./Canvas";
import * as S from "./styles";

interface Props {}

const Graph: React.FC<Props> = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvas = useRef<Canvas | null>(null);

  const currentUser = useAppSelector(state => state.users.currentUser);
  useEffect(() => {
    if (!canvasRef.current) {
      return () => {};
    }
    const graphCanvasObject = new Canvas(canvasRef.current);
    graphCanvas.current = graphCanvasObject;
    return () => {
      if (graphCanvas.current) {
        graphCanvas.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUser && graphCanvas.current) {
      graphCanvas.current.setCurrentUserNode(currentUser);
      graphCanvas.current.render();
    }
  }, [currentUser]);

  useEffect(() => {
    const onResize = () => {
      if (!divRef.current || !graphCanvas.current) {
        return;
      }
      const rect = divRef.current.getBoundingClientRect();

      graphCanvas.current.setSize(rect.width, rect.height);
      graphCanvas.current.render();
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <S.CanvasContainer ref={divRef}>
      <canvas ref={canvasRef} />
    </S.CanvasContainer>
  );
};

export default Graph;
