import { renderWithProviders } from "test-utils/mocks";
import { waitFor, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/friend.types";
import { Profile } from "server/models/profile.model";
import { QualityTags } from "server/models/qualityTags.model";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { profileStub } from "server/stubs/profiles.stub";
import { usersStub } from "server/stubs/users.stub";

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

const renderProfilePage = (
  currentUser: User | null,
  friendList: OneChonInfo[],
  currentProfile: (Profile & { qualityTags: QualityTags }) | null,
  alertProviderProps?: AlertContextProps,
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
    alertProviderProps,
  );
};

const currentProfileStub = {
  ...profileStub,
  qualityTags: [{ name: "t1" }, { name: "t2" }, { name: "t1" }],
};

const friendListStub = [{
  id: 1,
  firstname: "hi",
  lastname: "hi",
  imgUrl: "https://naver.com",
  chons: [
    { id: 2, firstname: "hi", lastname: "hi", imgUrl: "https://naver.com" },
    { id: 3, firstname: "hi", lastname: "hi", imgUrl: "https://naver.com" },
  ],
}];

describe("<ProfilePage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("renders profile page", async () => {
    renderProfilePage(null, [], null, alertProviderProps);
  });

  it("renders profile page with data", async () => {
    renderProfilePage(usersStub[0], friendListStub, currentProfileStub, alertProviderProps);
  });

  it("tests onClickChangeProfile", async () => {
    renderProfilePage(usersStub[0], friendListStub, currentProfileStub, alertProviderProps);
    const button = screen.getByText("프로필 수정");
    fireEvent.click(button);
  });

  it("tests onClickChatWithUser", async () => {
    renderProfilePage(usersStub[1], friendListStub, currentProfileStub, alertProviderProps);
    const button = screen.getByText("채팅하기");
    fireEvent.click(button);
  });

  it("tests onClickEvaluateQuality", async () => {
    renderProfilePage(usersStub[1], friendListStub, currentProfileStub, alertProviderProps);
    const button = screen.getByText("동료로서 평가하기");
    fireEvent.click(button);
  });

  // it("tests onClickAddFriend", async () => {
  //   renderProfilePage(usersStub[1], friendListStub, currentProfileStub, alertProviderProps);
  //   const button = screen.getByText("친구 추가하기");
  //   fireEvent.click(button);
  // });


  // it("tests alert", async () => {
  //   mockDispatch.mockReturnValueOnce({
  //     unwrap: () => Promise.reject({}),
  //   });
  //   renderProfilePage(null, [], null, alertProviderProps);
  //   waitFor(() => {
  //     const button = screen.getByText("존재하지 않는 유저입니다");
  //     console.log(button);
  //   });
  //   console.log("hi")
  // });
});
