import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import LoginModal, { LoginModalMessage } from "./LoginModal";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import SignUpPage from "containers/SignUpPage/SignUpPage";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  //useDispatch만 우리가 mocking
  useDispatch: () => mockDispatch,
}));

const renderLoginModal = (alertProviderProps?: AlertContextProps) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<LoginModal />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* TODO: the below should be changed to find account page */}
        <Route path="/account/find" element={<SignUpPage />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {},
    },
    alertProviderProps,
  );
};

describe("<LoginModal/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    // DESC: I have left this here so that
    // other developers can see how to mock a simple alert context
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("click sign up", async () => {
    renderLoginModal(alertProviderProps);
    const signUpButton = screen.getByRole("button", { name: /회원가입/i });
    fireEvent.click(signUpButton);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("click find account", async () => {
    renderLoginModal(alertProviderProps);
    const findAccountButton = screen.getByRole("button", {
      name: /비밀번호 찾기/i,
    });
    fireEvent.click(findAccountButton);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("click login error", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({ status: 401 }),
    });
    renderLoginModal(alertProviderProps);
    const usernameInput = screen.getByRole("username");
    const passwordInput = screen.getByRole("password");
    fireEvent.change(usernameInput, { target: { value: "swpp@snu.ac.kr" } });
    fireEvent.change(passwordInput, { target: { value: "iluvswpp" } });
    const loginButton = screen.getByRole("button", { name: /로그인하기/i });
    fireEvent.click(loginButton);
    //we do wait for since we have used usecallback
    waitFor(() => screen.getByText(LoginModalMessage.INVALID_LOGIN_INFO));
  });

  it("click login success", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
    renderLoginModal(alertProviderProps);
    const usernameInput = screen.getByRole("username");
    const passwordInput = screen.getByRole("password");
    fireEvent.change(usernameInput, { target: { value: "swpp@snu.ac.kr" } });
    fireEvent.change(passwordInput, { target: { value: "iluvswpp" } });
    const loginButton = screen.getByRole("button", { name: /로그인하기/i });
    fireEvent.click(loginButton);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("click login failure", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          response: {
            status: 401,
            statusText: "Unauthorized",
            data: {},
          },
        }),
    });
    renderLoginModal(alertProviderProps);
    const usernameInput = screen.getByRole("username");
    const passwordInput = screen.getByRole("password");
    fireEvent.change(usernameInput, { target: { value: "swpp@snu.ac.kr" } });
    fireEvent.change(passwordInput, { target: { value: "iluvswpp" } });
    const loginButton = screen.getByRole("button", { name: /로그인하기/i });
    fireEvent.click(loginButton);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
