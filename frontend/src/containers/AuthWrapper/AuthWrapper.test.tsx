import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { User } from "models/users.model";
import { renderWithProviders } from "test-utils/mocks";
import AuthWrapper from "./AuthWrapper";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  Navigate: (props: any) => {
    // we need to check navigate to
    mockNavigate(props.to);
    return null;
  },
}));

const stubUser: User = {
  id: 1,
  email: "swpp@snu.ac.kr",
  password: "iluvswpp",
  nickname: "swpp",
  name: "Software Lover",
};

const renderAuthWrapper = (user: User | null) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthWrapper>
              <div>fake-content</div>
            </AuthWrapper>
          }
        />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: user,
        },
      },
    },
  );
};

describe("<AuthWrapper/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navigates to login page when there is no current user", async () => {
    renderAuthWrapper(null);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("shows logout button as navbar when there is current user", async () => {
    renderAuthWrapper(stubUser);
    screen.getByRole("button", { name: /logout/i });
  });

  it("shows logout button as navbar when there is current user", async () => {
    const spyPutSignOut = jest
      .spyOn(axios, "put")
      .mockImplementationOnce(async () => ({}));
    renderAuthWrapper(stubUser);
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);
    //anything that has to do with react state update should be called with waitFor or act!!!
    await waitFor(() => expect(spyPutSignOut).toHaveBeenCalled());
  });
});
