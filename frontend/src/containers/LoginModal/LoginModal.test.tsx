import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import LoginModal from "./LoginModal";
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
        <Route path="/" element={<LoginModal message="message" />} />
        <Route path="/signup" element={<SignUpPage />} />
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

  it("click login error", async () => {
    renderLoginModal(alertProviderProps);
    mockDispatch.mockReturnValue(Promise.reject(new Error("error")));
    const emailInput = screen.getByPlaceholderText("이메일");
    const passwordInput = screen.getByPlaceholderText("비밀번호");
    fireEvent.change(emailInput, { target: { value: "swpp@snu.ac.kr" } });
    fireEvent.change(passwordInput, { target: { value: "iluvswpp" } });
    const loginButton = screen.getByRole("button", { name: /로그인하기/i });
    fireEvent.click(loginButton);
    //we do wait for since we have used usecallback
    waitFor(() => expect(alertProviderProps.open).toHaveBeenCalled());
  });

  it("click login success", async () => {
    renderLoginModal(alertProviderProps);
    const emailInput = screen.getByPlaceholderText("이메일");
    const passwordInput = screen.getByPlaceholderText("비밀번호");
    fireEvent.change(emailInput, { target: { value: "swpp@snu.ac.kr" } });
    fireEvent.change(passwordInput, { target: { value: "iluvswpp" } });
    const loginButton = screen.getByRole("button", { name: /로그인하기/i });
    fireEvent.click(loginButton);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
