import { screen, fireEvent, render } from "@testing-library/react";
import ChangePasswordPage from "./ChangePasswordPage";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import { Provider } from "react-redux";
import { act } from "@testing-library/react-hooks";
import axios from "axios";
import store from "store";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("<ChangePasswordPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should change password with valid form", async () => {
    // mockDispatch.mockReturnValue({ unwrap: () => {} });
    axios.put = jest.fn().mockResolvedValueOnce({});
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <ChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputNewPassword = screen.getByLabelText("새 비밀번호");
    const inputNewPasswordConfirm = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("submit");

    fireEvent.click(submitButton);

    await act(async () => {
      fireEvent.change(inputNewPassword, { target: { value: "123" } });
      fireEvent.change(inputNewPasswordConfirm, { target: { value: "123" } });
      fireEvent.click(submitButton);
    });

    const confirmButton = await screen.findByText("홈페이지로 이동");

    await act(async () => {
      fireEvent.click(confirmButton);
    });
  });

  it("tests 401 error", async () => {
    axios.put = jest.fn().mockRejectedValueOnce({ response: { status: 401 } });
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <ChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputNewPassword = screen.getByLabelText("새 비밀번호");
    const inputNewPasswordConfirm = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("submit");

    await act(async () => {
      fireEvent.click(submitButton);
      fireEvent.change(inputNewPassword, { target: { value: "123" } });
      fireEvent.change(inputNewPasswordConfirm, { target: { value: "123" } });
      fireEvent.click(submitButton);
    });

    const confirmButton = await screen.findByText(
      "아이디/비밀번호 찾기 페이지로 이동",
    );

    await act(async () => {
      fireEvent.click(confirmButton);
    });
  });

  it("tests 404 error", async () => {
    axios.put = jest.fn().mockRejectedValueOnce({ response: { status: 404 } });
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <ChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputNewPassword = screen.getByLabelText("새 비밀번호");
    const inputNewPasswordConfirm = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("submit");

    await act(async () => {
      fireEvent.click(submitButton);
      fireEvent.change(inputNewPassword, { target: { value: "123" } });
      fireEvent.change(inputNewPasswordConfirm, { target: { value: "123" } });
      fireEvent.click(submitButton);
    });

    await screen.findByText("유효하지 않은 토큰입니다.");
  });

  it("tests server error", async () => {
    axios.put = jest.fn().mockRejectedValueOnce({ response: { status: 500 } });
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <ChangePasswordPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputNewPassword = screen.getByLabelText("새 비밀번호");
    const inputNewPasswordConfirm = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("submit");

    await act(async () => {
      fireEvent.click(submitButton);
      fireEvent.change(inputNewPassword, { target: { value: "123" } });
      fireEvent.change(inputNewPasswordConfirm, { target: { value: "123" } });
      fireEvent.click(submitButton);
    });

    await screen.findByText("[서버 오류] 비밀번호 재설정에 실패했습니다.");
  });
});
