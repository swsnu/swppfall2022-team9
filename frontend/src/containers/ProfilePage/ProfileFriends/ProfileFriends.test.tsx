import { profileStub } from "server/stubs/profiles.stub";
import { renderWithProviders } from "test-utils/mocks";
import ProfileFriends from "./ProfileFriends";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Profile } from "server/models/profile.model";

const renderProfileFriends = (
  currentProfileUserId: number,
  currentProfileUserName: string,
  profileUserFriendProfiles:
    | Array<Profile & { name: string; id: number; profileImgUrl: string }>
    | undefined,
) => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProfileFriends
              currentProfileUserId={currentProfileUserId}
              currentProfileUserName={currentProfileUserName}
              profileUserFriendProfiles={profileUserFriendProfiles}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe("<ProfileFriends/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ProfileFriends", async () => {
    renderProfileFriends(1, "test", undefined);
  });

  it("renders ProfileFriends with friend profiles", async () => {
    renderProfileFriends(1, "test", [
      {
        ...profileStub,
        name: "name",
        id: 1,
        profileImgUrl: "url",
      },
    ]);
  });

  it("renders ProfileFriends with empty friends profile", async () => {
    renderProfileFriends(1, "test", []);
  });
});
