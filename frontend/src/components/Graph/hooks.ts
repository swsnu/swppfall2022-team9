import { RefObject, useEffect, useState } from "react";
import { useAppSelector } from "store/hooks";
import { Canvas } from "./Canvas";

interface Params {
  divRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

function useCanvas({ divRef, canvasRef }: Params) {
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const graphCanvasObject = new Canvas(canvasRef.current);
      setCanvas(graphCanvasObject);
    }

    return () => {
      if (canvas) {
        canvas.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (divRef.current && canvas) {
        const rect = divRef.current.getBoundingClientRect();
        canvas.setSize(rect.width, rect.height);
        canvas.render();
        console.log("hihihi");
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [canvas, divRef]);

  return canvas;
}

export default useCanvas;
