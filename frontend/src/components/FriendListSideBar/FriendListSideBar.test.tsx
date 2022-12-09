import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { renderWithProviders } from "test-utils/mocks";
import FriendListSideBar from "./FriendListSideBar";
import {
  screen,
  fireEvent,
} from "@testing-library/react";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const renderFriendListSideBar = (  alertProviderProps?: AlertContextProps,
  ) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<FriendListSideBar />}></Route>
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: {
            id: 1,
            email: "email@email.com",
            password: "123",
            username: "jubby",
            firstname: "iluv",
            lastname: "swpp",
            imgUrl: "",
          },
          friendList: [
            {
              id: 1,
              firstname: "swpp",
              lastname: "snu",
              imgUrl: "spl.snu.ac.kr",
              chons: [],
            },
          ],
        },
      },
    },
    alertProviderProps,
  );
};

describe("<FriendListSideBar/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("renders FriendListSideBar", async () => {
    renderFriendListSideBar(alertProviderProps);
  });

  it("clicks invite button", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({}),
    });
    renderFriendListSideBar(alertProviderProps);
    const button = screen.getAllByRole("button")[0]
    fireEvent.click(button);
  });

  it("clicks invite button and tests error", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    renderFriendListSideBar(alertProviderProps);
    const button = screen.getAllByRole("button")[0]
    fireEvent.click(button);
  });
});
