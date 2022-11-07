import { SetStateAction, useEffect } from "react";

interface Params {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapperRef: React.RefObject<any>;
  setIsClickedOutside: React.Dispatch<SetStateAction<boolean>>;
}

function useHandleClickOutside({ wrapperRef, setIsClickedOutside }: Params) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsClickedOutside(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return wrapperRef.current;
}

export default useHandleClickOutside;
