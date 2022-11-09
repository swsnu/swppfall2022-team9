import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "store";
import App from "App";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import axios from "axios";

// this sets our csrf token
axios.get("/api/csrf_token/");

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
