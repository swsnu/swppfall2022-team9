import { RefObject, useEffect, useState } from "react";
import Canvas from "../utils/Canvas";

interface Params {
  divRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  onSetViewProfileCallback: (id: number) => void;
}

function useCanvas({ divRef, canvasRef, onSetViewProfileCallback }: Params) {
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const graphCanvasObject = new Canvas(canvasRef.current);
      setCanvas(graphCanvasObject);
    }

    // testing할때 안잡힘..
    // return () => {
    //   if (canvas) {
    //     canvas.destroy();
    //   }
    // };
  }, [canvasRef]);

  useEffect(() => {
    const onResize = () => {
      if (divRef.current && canvas) {
        const dpr = window.devicePixelRatio;
        const rect = divRef.current.getBoundingClientRect();
        canvas.setSize(rect.width, rect.height, dpr);
        canvas.scale(dpr, dpr);
        canvas.render();
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    canvas?.addEventListener("setPreviewProfile", onSetViewProfileCallback);
    return () => {
      window.removeEventListener("resize", onResize);
      canvas?.removeEventListener(
        "setPreviewProfile",
        onSetViewProfileCallback,
      );
    };
  }, [canvas, divRef]);

  return canvas;
}

export default useCanvas;
