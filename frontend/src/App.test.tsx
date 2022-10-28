/* eslint-disable react/react-in-jsx-scope */
import { render } from "@testing-library/react";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

test("renders App.tsx", () => {
  render(
    <AlertContextProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AlertContextProvider>,
  );
});
