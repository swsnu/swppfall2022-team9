import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/friend.types";
import { Profile } from "server/models/profile.model";
import { QualityTags } from "server/models/qualityTags.model";

const mockNavigate = jest.fn();
//외부 dependency useNavigate
jest.mock("react-router", () => ({
  //그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));
const mockDispatch = jest.fn();

//useDispatch mockign
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  //useDispatch만 우리가 mocking
  useDispatch: () => mockDispatch,
}));

const renderProfilePage = (
  currentUser: User | null,
  friendList: OneChonInfo[],
  currentProfile: (Profile & { qualityTags: QualityTags }) | null,
) => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/:userId" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/1" />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser,
          friendList,
        },
        profile: {
          currentProfile,
        },
      },
    },
  );
};

describe("<ProfilePage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    renderProfilePage(null, [], null);
  });
});
