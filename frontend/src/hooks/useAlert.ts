import {
  AlertContext,
  AlertContextProps,
} from "containers/Context/AlertContext/AlertContext";
import { useContext } from "react";

const useAlert = (): AlertContextProps => {
  const alertContext = useContext(AlertContext);
  return alertContext;
};

export default useAlert;
