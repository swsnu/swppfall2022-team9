import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import ChangePasswordPage from "./ChangePasswordPage";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { usersStub } from "server/stubs/users.stub";

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

const renderChangePasswordPageWithToken = (
  alertProviderProps?: AlertContextProps,
) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route
          path="/account/password/:token"
          element={<ChangePasswordPage />}
        />
        <Route path="*" element={<Navigate to={"/account/password/1"} />} />
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
describe("<ChangePasswordPage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("renders Change Password no token", async () => {
    render(<ChangePasswordPage />);
    waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    const simpleMessageButton = await waitFor(() =>
      screen.getByRole("simpleMessageButton"),
    );
    fireEvent.click(simpleMessageButton);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("renders change password with token", async () => {
    mockDispatch.mockReturnValueOnce({
      unwrap: () => Promise.resolve({}),
    });
    renderChangePasswordPageWithToken(alertProviderProps);
    const submitButton = await waitFor(() => screen.getByRole("submit"));
    fireEvent.click(submitButton);
    const passwordInput = screen.getByRole("passwordInput");
    fireEvent.change(passwordInput, { target: { value: "test" } });
    const passwordCheckInput = screen.getByRole("passwordCheckInput");
    fireEvent.change(passwordCheckInput, { target: { value: "different" } });
    fireEvent.click(submitButton);
    waitFor(() => screen.getByText("입력한 비밀번호가 서로 다릅니다!"));
    fireEvent.change(passwordCheckInput, { target: { value: "test" } });
    fireEvent.click(submitButton);
  });

  it("renders Change Password with wrong token", async () => {
    mockDispatch.mockReturnValueOnce({
      // for checking error set return value as reject
      unwrap: () => Promise.reject(new Error()),
    });
    renderChangePasswordPageWithToken(alertProviderProps);
    waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    const simpleMessageButton = await waitFor(() =>
      screen.getByRole("simpleMessageButton"),
    );
    fireEvent.click(simpleMessageButton);
  });
});
