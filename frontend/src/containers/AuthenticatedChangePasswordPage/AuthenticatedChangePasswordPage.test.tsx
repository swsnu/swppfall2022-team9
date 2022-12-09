import { screen, fireEvent, render } from "@testing-library/react";
import AuthenticatedChangePasswordPage from "./AuthenticatedChangePasswordPage";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import { usersStub } from "server/stubs/users.stub";
import { Provider } from "react-redux";
import { setupStore } from "store/slices";
import { act } from "react-dom/test-utils";

const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("<AuthenticatedChangePasswordPage/>", () => {
  const preloadedState = {
    users: {
      currentUser: usersStub[0],
      friendList: [],
    },
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders AuthenticatedChangePasswordPage change password", async () => {
    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AuthenticatedChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );
    const submitButton = screen.getByRole("submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const currentPasswordInput = screen.getByRole("currentPasswordInput");
    await act(async () => {
      fireEvent.change(currentPasswordInput, { target: { value: "test" } });
    });
    const passwordInput = screen.getByRole("passwordInput");
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "test" } });
    });
    const passwordCheckInput = screen.getByRole("passwordCheckInput");
    await act(async () => {
      fireEvent.change(passwordCheckInput, { target: { value: "test" } });
      fireEvent.click(submitButton);
    });
  });

  it("successfully change password", async () => {
    mockDispatch.mockReturnValue({ unwrap: () => {} });

    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AuthenticatedChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );

    const currentPasswordInput = screen.getByRole("currentPasswordInput");
    const passwordInput = screen.getByRole("passwordInput");
    const passwordCheckInput = screen.getByRole("passwordCheckInput");
    const submitButton = screen.getByRole("submit");

    await act(async () => {
      fireEvent.change(currentPasswordInput, { target: { value: "test" } });
      fireEvent.change(passwordInput, { target: { value: "test1" } });
      fireEvent.change(passwordCheckInput, { target: { value: "test1" } });
      fireEvent.click(submitButton);
    });

    const confirmButton = await screen.findByText("확인");
    await act(async () => {
      fireEvent.click(confirmButton);
    });
  });

  it("password !== passwordCheck", async () => {
    mockDispatch.mockReturnValue({ unwrap: () => {} });

    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AuthenticatedChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );

    const submitButton = screen.getByRole("submit");
    const currentPasswordInput = screen.getByRole("currentPasswordInput");
    const passwordInput = screen.getByRole("passwordInput");
    const passwordCheckInput = screen.getByRole("passwordCheckInput");
    await act(async () => {
      fireEvent.change(currentPasswordInput, { target: { value: "test" } });
      fireEvent.change(passwordInput, { target: { value: "test1" } });
      fireEvent.change(passwordCheckInput, { target: { value: "test2" } });
      fireEvent.click(submitButton);
    });
  });

  it("server error", async () => {
    mockDispatch
      .mockReturnValueOnce({ unwrap: () => {} })
      .mockResolvedValueOnce({});

    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AuthenticatedChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );

    const submitButton = screen.getByRole("submit");
    const currentPasswordInput = screen.getByRole("currentPasswordInput");
    const passwordInput = screen.getByRole("passwordInput");
    const passwordCheckInput = screen.getByRole("passwordCheckInput");
    await act(async () => {
      fireEvent.change(currentPasswordInput, { target: { value: "test" } });
      fireEvent.change(passwordInput, { target: { value: "test1" } });
      fireEvent.change(passwordCheckInput, { target: { value: "test1" } });
      fireEvent.click(submitButton);
    });
  });

  it("password === currentPassword", async () => {
    mockDispatch.mockReturnValue({ unwrap: () => {} });
    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AuthenticatedChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );
    const submitButton = screen.getByRole("submit");
    const currentPasswordInput = screen.getByRole("currentPasswordInput");
    const passwordInput = screen.getByRole("passwordInput");
    const passwordCheckInput = screen.getByRole("passwordCheckInput");
    await act(async () => {
      fireEvent.change(currentPasswordInput, { target: { value: "test" } });
      fireEvent.change(passwordInput, { target: { value: "test" } });
      fireEvent.change(passwordCheckInput, { target: { value: "test" } });
      fireEvent.click(submitButton);
    });
  });
});
