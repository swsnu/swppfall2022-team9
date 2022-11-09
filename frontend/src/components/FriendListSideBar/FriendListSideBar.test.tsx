import { MemoryRouter, Routes, Route } from "react-router-dom";
import { renderWithProviders } from "test-utils/mocks";
import FriendListSideBar from "./FriendListSideBar";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const renderFriendListSideBar = () => {
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
          },
          chonList: [
            {
              id: 1,
              firstname: "swpp",
              lastname: "snu",
              imgUrl: "spl.snu.ac.kr",
            },
          ],
        },
      },
    },
  );
};

describe("<FriendListSideBar/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders FriendListSideBar", async () => {
    renderFriendListSideBar();
  });
});
