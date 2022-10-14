import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "store";
import App from "App";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import { initMockAPI } from "mocks";

// Start the mocking conditionally.
if (process.env.ENABLE_API_MOCK) {
  initMockAPI();
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AlertContextProvider>
        <App />
      </AlertContextProvider>
    </Provider>
  </React.StrictMode>,
);
