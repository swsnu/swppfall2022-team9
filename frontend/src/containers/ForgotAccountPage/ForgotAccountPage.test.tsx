import { act, fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import { Provider } from "react-redux";
import store from "store";
import ForgotAccountPage from "./ForgotAccountPage";

const renderForgotAccountPage = () => {
  render(
    <AlertContextProvider>
      <Provider store={store}>
        <ForgotAccountPage />
      </Provider>
    </AlertContextProvider>,
  );
};

describe("<ForgotAccountPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("tests id and password check", async () => {
    axios.get = jest.fn().mockResolvedValueOnce({ data: { username: "재승" } });
    renderForgotAccountPage();
    const idCheckInput = screen.getByRole("findIdCheck");
    const passwordCheckInput = screen.getByRole("findPasswordCheck");
    const submitButton = screen.getByRole("button");
    fireEvent.click(idCheckInput);

    const emailInput = await screen.findByLabelText("이메일 입력");
    fireEvent.click(submitButton);
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "swpp@snu.ac.kr" } });
    });
    fireEvent.click(submitButton);
    await screen.findByText("재승");

    axios.get = jest.fn().mockResolvedValueOnce({ data: {} });
    axios.post = jest.fn().mockResolvedValueOnce({});
    fireEvent.click(passwordCheckInput);
    const usernameInput = await screen.findByLabelText("아이디 입력");
    fireEvent.click(submitButton);
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "wotmd" } });
    });
    fireEvent.click(submitButton);
    await screen.findByText("등록된 이메일로 링크가 전송되었습니다.");
  });

  it("tests id 404 error", async () => {
    axios.get = jest.fn().mockRejectedValueOnce({ response: { status: 404 } });
    renderForgotAccountPage();
    const idCheckInput = screen.getByRole("findIdCheck");
    const submitButton = screen.getByRole("button");
    fireEvent.click(idCheckInput);

    const emailInput = await screen.findByLabelText("이메일 입력");
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "swpp@snu.ac.kr" } });
    });
    fireEvent.click(submitButton);
    await screen.findByText("해당 이메일로 등록된 사용자 정보가 없습니다.");
  });

  it("tests id server error", async () => {
    axios.get = jest.fn().mockRejectedValueOnce({ response: { status: 500 } });
    renderForgotAccountPage();
    const idCheckInput = screen.getByRole("findIdCheck");
    const submitButton = screen.getByRole("button");
    fireEvent.click(idCheckInput);

    const emailInput = await screen.findByLabelText("이메일 입력");
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "swpp@snu.ac.kr" } });
    });
    fireEvent.click(submitButton);
    await screen.findByText("[서버 오류] 아이디 찾기에 실패했습니다.");
  });

  it("tests password 404 error", async () => {
    axios.post = jest.fn().mockRejectedValueOnce({ response: { status: 404 } });
    renderForgotAccountPage();
    const passwordCheckInput = screen.getByRole("findPasswordCheck");
    const submitButton = screen.getByRole("button");
    fireEvent.click(passwordCheckInput);

    const usernameInput = await screen.findByLabelText("아이디 입력");
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "wotmd" } });
    });
    fireEvent.click(submitButton);
    await screen.findByText("해당 아이디로 등록된 사용자 정보가 없습니다.");
  });

  it("tests password server error", async () => {
    axios.post = jest.fn().mockRejectedValueOnce({ response: { status: 500 } });
    renderForgotAccountPage();
    const passwordCheckInput = screen.getByRole("findPasswordCheck");
    const submitButton = screen.getByRole("button");
    fireEvent.click(passwordCheckInput);

    const usernameInput = await screen.findByLabelText("아이디 입력");
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "wotmd" } });
    });
    fireEvent.click(submitButton);
    await screen.findByText("[서버 오류] 비밀번호 찾기에 실패했습니다.");
  });
});
