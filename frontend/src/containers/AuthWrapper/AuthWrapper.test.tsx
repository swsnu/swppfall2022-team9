import { MemoryRouter, Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import { User } from "server/models/users.model";
import { renderWithProviders } from "test-utils/mocks";
import AuthWrapper from "./AuthWrapper";
import { usersStub } from "server/stubs/users.stub";
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

const renderAuthWrapper = (user: User | null, chonList: OneChonInfo[]) => {
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
    renderAuthWrapper(null, []);
    screen.getByText("로그인하기");
  });

  it("shows logout button as navbar when there is current user", async () => {
    renderAuthWrapper(usersStub[0], []);
    screen.getByText("fake-content");
  });
});
