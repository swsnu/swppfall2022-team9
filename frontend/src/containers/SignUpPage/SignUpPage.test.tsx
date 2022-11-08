import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import SignUpPage, { HelperText } from "./SignUpPage";
import {
  AlertContextProps,
  AlertContextProvider,
} from "containers/Context/AlertContext/AlertContext";
import { Provider } from "react-redux";
import store from "store";
import { postSignUp } from "store/slices/users";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const renderSignUpPage = (alertProviderProps?: AlertContextProps) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to={"/signup"} />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {},
    },
    alertProviderProps,
  );
};

describe("<SignUpPage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("should render without errors", () => {
    renderSignUpPage(alertProviderProps);
    screen.getByLabelText("성");
    screen.getByLabelText("이름");
    screen.getByLabelText("이메일");
    screen.getByLabelText("아이디");
    screen.getByLabelText("비밀번호");
    screen.getByLabelText("비밀번호 확인");
  });

  it("should show appropriate helper message for each input", () => {
    renderSignUpPage(alertProviderProps);
    const inputPassword = screen.getByLabelText("비밀번호");
    const inputPasswordConfirm = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("button");
    // Input is empty
    fireEvent.click(submitButton);
    screen.findByText(HelperText.REQUIRED);

    // Password confirm is not identical to password
    fireEvent.change(inputPassword, { target: { value: "1234" } });
    fireEvent.change(inputPasswordConfirm, {
      target: { value: "123" },
    });
    fireEvent.click(submitButton);
    screen.findByText(HelperText.DIFFERENT_PASSWORD);
  });

  it("should sign up with valid form", async () => {
    mockDispatch.mockResolvedValue({
      type: `${postSignUp.typePrefix}/fulfilled`,
    });
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <SignUpPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputLastName = screen.getByLabelText("성");
    const inputFirstName = screen.getByLabelText("이름");
    const inputEmail = screen.getByLabelText("이메일");
    const inputUserName = screen.getByLabelText("아이디");
    const inputPassword = screen.getByLabelText("비밀번호");
    const inputPasswordConfirm = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("button", { name: "가입하기" });
    fireEvent.change(inputLastName, { target: { value: "권" } });
    fireEvent.change(inputFirstName, { target: { value: "나라" } });
    fireEvent.change(inputEmail, { target: { value: "swpp@snu.ac.kr" } });
    fireEvent.change(inputUserName, { target: { value: "swpp" } });
    fireEvent.change(inputPassword, { target: { value: "1234" } });
    fireEvent.change(inputPasswordConfirm, {
      target: { value: "1234" },
    });
    await screen.findByDisplayValue("권");
    await screen.findByDisplayValue("나라");
    await screen.findByDisplayValue("swpp@snu.ac.kr");
    await screen.findByDisplayValue("swpp");
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    await screen.findByRole("button", { name: "확인" });

    const modalButton = screen.getByRole("button", { name: "확인" });
    fireEvent.click(modalButton);
  });

  it("should alert error when submitted", async () => {
    mockDispatch.mockResolvedValue({
      type: `${postSignUp.typePrefix}/rejected`,
    });
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <SignUpPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputLastName = screen.getByLabelText("성");
    const inputFirstName = screen.getByLabelText("이름");
    const inputEmail = screen.getByLabelText("이메일");
    const inputUserName = screen.getByLabelText("아이디");
    const inputPassword = screen.getByLabelText("비밀번호");
    const inputPasswordConfirm = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("button");
    fireEvent.change(inputLastName, { target: { value: "권" } });
    fireEvent.change(inputFirstName, { target: { value: "나라" } });
    fireEvent.change(inputEmail, { target: { value: "swpp@snu.ac.kr" } });
    fireEvent.change(inputUserName, { target: { value: "swpp" } });
    fireEvent.change(inputPassword, { target: { value: "1234" } });
    fireEvent.change(inputPasswordConfirm, {
      target: { value: "1234" },
    });
    await screen.findByDisplayValue("권");
    await screen.findByDisplayValue("나라");
    await screen.findByDisplayValue("swpp@snu.ac.kr");
    await screen.findByDisplayValue("swpp");
    fireEvent.click(submitButton);

    await screen.findByText("서버 오류: 회원가입에 실패했습니다!");
  });
});