import { MemoryRouter, Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import { User } from "models/users.model";
import { renderWithProviders } from "test-utils/mocks";
import AuthWrapper, { LoginModalMessage } from "./AuthWrapper";
import { usersStub } from "mocks/stubs/users.stub";
import { OneChonInfo } from "types/chon.types";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Navigate: (props: any) => {
    // we need to check navigate to
    mockNavigate(props.to);
    return null;
  },
}));

const renderAuthWrapper = (
  user: User | null,
  chonList: OneChonInfo[] | null,
) => {
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
          chonList: chonList,
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
    renderAuthWrapper(null, null);
    screen.getByText(LoginModalMessage.NOT_AUTHENTICATED);
  });

  it("shows logout button as navbar when there is current user", async () => {
    renderAuthWrapper(usersStub[0], null);
    screen.getByText("fake-content");
  });
});
