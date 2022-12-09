import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "./HomePage";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { usersStub } from "server/stubs/users.stub";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import { Provider } from "react-redux";
import { setupStore } from "store/slices";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "store";

const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const renderHomePage = (
  preloadedState: PreloadedState<RootState>,
  token: boolean,
) => {
  render(
    <AlertContextProvider>
      <Provider store={setupStore(preloadedState)}>
        <MemoryRouter>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            {token ? (
              <Route
                path="*"
                element={<Navigate to={`/home?invite=token`} />}
              />
            ) : (
              <Route path="*" element={<Navigate to={`/home`} />} />
            )}
          </Routes>
        </MemoryRouter>
      </Provider>
    </AlertContextProvider>,
  );
};

describe("<ChangePasswordPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders HomePage with a user", async () => {
    const preloadedState = {
      users: {
        currentUser: usersStub[0],
        friendList: [],
      },
    };
    mockDispatch.mockReturnValue({});
    renderHomePage(preloadedState, false);
  });

  it("handles friendInviteToken", async () => {
    const preloadedState = {
      users: {
        currentUser: null,
        friendList: [],
        sessionError: "none",
      },
    };
    mockDispatch.mockReturnValue({});
    renderHomePage(preloadedState, true);
    const modalButton = await screen.findByText("회원가입하기");
    fireEvent.click(modalButton);
  });

  it("tests friendInviteToken from localStorage", async () => {
    const preloadedState = {
      users: {
        currentUser: usersStub[0],
        friendList: [],
        sessionError: "none",
      },
    };
    mockDispatch.mockReturnValue({});
    window.localStorage.setItem("inviteToken", "token");
    renderHomePage(preloadedState, true);
  });
});
