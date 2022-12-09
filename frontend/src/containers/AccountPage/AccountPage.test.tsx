import { screen, fireEvent } from "@testing-library/react";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { usersStub } from "server/stubs/users.stub";
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

  it("clicks submit", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    renderAccountPage(alertProviderProps);
    const form = screen.getByRole("submit");
    fireEvent.submit(form);
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

  it("tests value change", async () => {
    renderAccountPage(alertProviderProps);
    const lastname = screen.getByRole("lastname");
    fireEvent.change(lastname, {target: {value: "hi"}});
    const firstname = screen.getByRole("firstname");
    fireEvent.change(firstname, {target: {value: "hi"}});
    const email = screen.getByRole("email");
    fireEvent.change(email, {target: {value: "hi"}});
  
  
  });
});
