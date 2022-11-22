import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { profileStub } from "server/stubs/profiles.stub";
import { Profile } from "server/models/profile.model";
import ProfileFriendItem from "./ProfileFriendItem";
import { usersStub } from "server/stubs/users.stub";
import { OneChonInfo } from "types/friend.types";
import { User } from "server/models/users.model";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const renderProfileFriendItem = (
  currentProfileUserId: number,
  currentProfileUserName: string,
  profileUserFriend: Profile & {
    name: string;
    id: number;
    profileImgUrl: string;
  },
  currentUser: User | null,
  friendList: OneChonInfo[],
) => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProfileFriendItem
              currentProfileUserId={currentProfileUserId}
              currentProfileUserName={currentProfileUserName}
              profileUserFriend={profileUserFriend}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser,
          friendList,
        },
      },
    },
  );
};

const profileUserFriend = {
  ...profileStub,
  name: "name",
  id: 1,
  profileImgUrl: "url",
};
const friendList = [
  {
    chons: [
      {
        id: 1,
        firstname: "hi",
        lastname: "hi",
        imgUrl: "https://www.naver.com",
      },
    ],
    id: 1,
    firstname: "hi",
    lastname: "hi",
    imgUrl: "https://www.naver.com",
  },
];

describe("<ProfileFriendItem/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ProfileFriendItem", async () => {
    renderProfileFriendItem(
      1,
      "test",
      profileUserFriend,
      usersStub[0],
      friendList,
    );
  });

  it("tests onClickFriend button", async () => {
    renderProfileFriendItem(
      1,
      "test",
      profileUserFriend,
      usersStub[0],
      friendList,
    );
    const clickFrined = screen.getByRole("list");
    fireEvent.click(clickFrined);
  });

  it("tests onAskFriendForIntroduction buttons", async () => {
    renderProfileFriendItem(
      1,
      "test",
      profileUserFriend,
      usersStub[0],
      friendList,
    );
    screen.debug();
    const askFriend = screen.getByRole("button");
    fireEvent.click(askFriend);
  });
});
