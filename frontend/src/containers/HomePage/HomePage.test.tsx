import { render } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import HomePage from "./HomePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { usersStub } from "server/stubs/users.stub";

const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const renderHomePage = () => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
  );
};
describe("<ChangePasswordPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders HomePage with a user", async () => {
    renderHomePage();
  });
});
