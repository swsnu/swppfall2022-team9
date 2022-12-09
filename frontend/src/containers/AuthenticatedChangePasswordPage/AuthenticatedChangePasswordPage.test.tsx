import { screen, fireEvent } from "@testing-library/react";
import AuthenticatedChangePasswordPage from "./AuthenticatedChangePasswordPage";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

const renderAuthenticatedChangePasswordPage = (
  alertProviderProps?: AlertContextProps,
) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<AuthenticatedChangePasswordPage />} />
      </Routes>
    </MemoryRouter>,
    { preloadedState: {} },
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

describe("<AuthenticatedChangePasswordPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders AuthenticatedChangePasswordPage change password", async () => {
    renderAuthenticatedChangePasswordPage();
    const submitButton = screen.getByRole("submit");
    fireEvent.click(submitButton);
    const currentPasswordInput = screen.getByRole("currentPasswordInput");
    fireEvent.change(currentPasswordInput, { target: { value: "test" } });
    const passwordInput = screen.getByRole("passwordInput");
    fireEvent.change(passwordInput, { target: { value: "test" } });
    const passwordCheckInput = screen.getByRole("passwordCheckInput");
    fireEvent.change(passwordCheckInput, { target: { value: "test" } });
    fireEvent.click(submitButton);
  });

  it("renders AuthenticatedChangePasswordPage change password", async () => {
    mockDispatch.mockReturnValue(
      {unwrap: () => {}}
    )
    axios.post = jest.fn().mockResolvedValue({});
    renderAuthenticatedChangePasswordPage();
    const submitButton = screen.getByRole("submit");
    const currentPasswordInput = screen.getByRole("currentPasswordInput");
    fireEvent.change(currentPasswordInput, { target: { value: "test" } });
    const passwordInput = screen.getByRole("passwordInput");
    fireEvent.change(passwordInput, { target: { value: "test" } });
    const passwordCheckInput = screen.getByRole("passwordCheckInput");
    fireEvent.change(passwordCheckInput, { target: { value: "test1" } });
    
    fireEvent.click(submitButton);
  });
});
