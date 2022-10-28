import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "store";
import App from "App";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <AlertContextProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AlertContextProvider>
  </React.StrictMode>,
);
