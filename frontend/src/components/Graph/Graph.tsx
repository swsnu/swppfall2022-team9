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
      if (graphCanvas.current) {
        graphCanvas.current.clear();
      }
    };
  }, []);

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
    <div ref={divRef} style={{ flex: "1 0" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Graph;
