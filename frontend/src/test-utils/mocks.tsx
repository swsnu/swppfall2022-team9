import { PreloadedState } from "@reduxjs/toolkit";
import { render, RenderOptions } from "@testing-library/react";
import {
  AlertContext,
  AlertContextProps,
} from "containers/Context/AlertContext/AlertContext";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { AppStore, RootState } from "store";
import { setupStore } from "store/slices";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
  alertProviderProps?: AlertContextProps,
) {
  const Wrapper = ({ children }: PropsWithChildren): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };
  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(
      <AlertContext.Provider
        value={
          !alertProviderProps
            ? {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                open: data => {},
                close: () => {},
              }
            : alertProviderProps
        }
      >
        {ui}
      </AlertContext.Provider>,
      { wrapper: Wrapper, ...renderOptions },
    ),
  };
}
