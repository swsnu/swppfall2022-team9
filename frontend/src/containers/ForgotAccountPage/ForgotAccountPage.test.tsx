import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ForgotAccountPage from "./ForgotAccountPage";

describe("<ForgotAccountPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("checks id check", async () => {
    render(<ForgotAccountPage />);
    // await waitFor(() => screen.getByText("아이디 찾기"));
    const idCheckInput = screen.getByRole("findIdCheck");
    fireEvent.click(idCheckInput);
    const emailInput = await waitFor(() =>
      screen.getByRole("forgotAccountInput"),
    );
    fireEvent.change(emailInput, { target: { value: "swpp@snu.ac.kr" } });
    // await waitFor(() => screen.getByText("swpp@snu.ac.kr"));
    const submitButton = await waitFor(() =>
      screen.getByRole("button", {
        name: "아이디 조회",
      }),
    );
    fireEvent.click(submitButton);
    const passwordCheckInput = screen.getByRole("findPasswordCheck");

    fireEvent.click(passwordCheckInput);
    await waitFor(() => screen.getByText("인증 이메일 보내기"));
    fireEvent.click(idCheckInput, {
      target: { checked: false },
    });
  });

  it("checks password check", async () => {
    render(<ForgotAccountPage />);
    const passwordCheckInput = screen.getByRole("findPasswordCheck");
    fireEvent.click(passwordCheckInput);
    const submitButton = await waitFor(() =>
      screen.getByRole("button", {
        name: "인증 이메일 보내기",
      }),
    );
    const usernameInput = await waitFor(() =>
      screen.getByRole("forgotAccountInput"),
    );
    fireEvent.change(usernameInput, { target: { value: "swpp" } });
    // await waitFor(() => screen.getByText("swpp"));
    fireEvent.click(submitButton);
    const idCheckInput = screen.getByRole("findIdCheck");
    fireEvent.click(idCheckInput);
    await waitFor(() => screen.getByText("아이디 조회"));
    fireEvent.click(passwordCheckInput, {
      target: { checked: false },
    });
  });

  // TODO add tests for dispatch
});
