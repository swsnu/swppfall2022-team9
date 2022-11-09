import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { renderWithProviders } from "test-utils/mocks";
import ForgotAccountPage from "./ForgotAccountPage";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";

const renderForgotAccountPage = (alertProviderProps?: AlertContextProps) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<ForgotAccountPage />} />
      </Routes>
    </MemoryRouter>,
    { preloadedState: {} },
    alertProviderProps,
  );
};

describe("<ForgotAccountPage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("checks id check", async () => {
    renderForgotAccountPage(alertProviderProps);
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
    renderForgotAccountPage(alertProviderProps);
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
