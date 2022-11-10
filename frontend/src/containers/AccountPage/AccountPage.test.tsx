import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import {
  AlertContextProps,
  AlertContextProvider,
} from "containers/Context/AlertContext/AlertContext";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { usersStub } from "server/stubs/users.stub";
import store from "store";
import { renderWithProviders } from "test-utils/mocks";
import AccountPage from "./AccountPage";

const renderAccountPage = (alertProviderProps?: AlertContextProps) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<AccountPage />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: usersStub[0],
          friendList: [],
        },
      },
    },
    alertProviderProps,
  );
};
const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  //useDispatch만 우리가 mocking
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("<AccountPage/>", () => {
  let alertProviderProps: AlertContextProps;

  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("renders account page", async () => {
    renderAccountPage(alertProviderProps);
    const birthdateInput = screen.getByRole("birthdate");
    fireEvent.change(birthdateInput, { target: { value: "1998-06-29" } });
  });

  it("on click change password", async () => {
    renderAccountPage(alertProviderProps);
    const changePasswordButton = screen.getByRole("changePassword");
    fireEvent.click(changePasswordButton);
    expect(mockNavigate).toBeCalledWith("/account/password");
  });

  it("on click logout", async () => {
    renderAccountPage(alertProviderProps);
    const logoutButton = screen.getByRole("button", {
      name: /로그아웃/i,
    });
    fireEvent.click(logoutButton);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("on click delete account cancel", async () => {
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </AlertContextProvider>,
    );
    const deleteAccountButton = screen.getByRole("button", {
      name: /계정삭제/i,
    });
    fireEvent.click(deleteAccountButton);
    waitFor(() => screen.findByText("계정 삭제를 진행할까요?"));
    const closeButton = await screen.findByRole("button", { name: "아니오" });
    fireEvent.click(closeButton);
  });

  it("on click delete account confirm", async () => {
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </AlertContextProvider>,
    );
    const deleteAccountButton = screen.getByRole("button", {
      name: /계정삭제/i,
    });
    fireEvent.click(deleteAccountButton);
    // TODO: on click delete account
    waitFor(() => screen.findByText("계정 삭제를 진행할까요?"));
    const confirmButton = await screen.findByRole("button", { name: "네" });
    fireEvent.click(confirmButton);
  });
});
