import React, { useEffect, useRef } from "react";
import { Canvas } from "./Canvas";

interface Props {}

const Graph: React.FC<Props> = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvas = useRef<Canvas | null>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      return () => {};
    }
    const graphCanvasObject = new Canvas(canvasRef.current);
    graphCanvas.current = graphCanvasObject;
    return () => {
      galaxyCanvas.clear();
    };
  }, []);
  return (
    <div ref={divRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Graph;
