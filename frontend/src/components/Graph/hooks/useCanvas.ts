import { RefObject, useEffect, useState } from "react";
import { useAppDispatch } from "store/hooks";
import { getProfile, profileActions } from "store/slices/profile";
import Canvas from "../utils/Canvas";

interface Params {
  divRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

function useCanvas({ divRef, canvasRef }: Params) {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const dispatch = useAppDispatch();

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

    const mouseDownSetPreviewProfile = (id: number | null) => {
      if (id) {
        dispatch(getProfile(id))
          .unwrap()
          .then(data => {
            dispatch(profileActions.setPreviewProfile({ ...data, id }));
          });
      } else {
        dispatch(profileActions.setPreviewProfile(null));
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    canvas?.addEventListener("setPreviewProfile", mouseDownSetPreviewProfile);
    return () => {
      window.removeEventListener("resize", onResize);
      canvas?.removeEventListener(
        "setPreviewProfile",
        mouseDownSetPreviewProfile,
      );
    };
  }, [canvas, divRef]);

  return canvas;
}

export default useCanvas;
