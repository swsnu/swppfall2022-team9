import { renderWithProviders } from "test-utils/mocks";
import { waitFor, screen, fireEvent, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/friend.types";
import { Profile } from "server/models/profile.model";
import { QualityTags } from "server/models/qualityTags.model";
import {
  AlertContextProps,
  AlertContextProvider,
} from "containers/Context/AlertContext/AlertContext";
import { profileStub } from "server/stubs/profiles.stub";
import { profilePageUsersStub } from "server/stubs/users.stub";
import { Provider } from "react-redux";
import store from "store";

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

const friendListStub = [
  {
    id: 1,
    firstname: "hi",
    lastname: "hi",
    imgUrl: "https://naver.com",
    chons: [
      { id: 2, firstname: "hi", lastname: "hi", imgUrl: "https://naver.com" },
      { id: 3, firstname: "hi", lastname: "hi", imgUrl: "https://naver.com" },
    ],
  },
];

const friendListStub2 = [
  {
    id: 2,
    firstname: "hi",
    lastname: "hi",
    imgUrl: "https://naver.com",
    chons: [
      { id: 3, firstname: "hi", lastname: "hi", imgUrl: "https://naver.com" },
      { id: 4, firstname: "hi", lastname: "hi", imgUrl: "https://naver.com" },
    ],
  },
  {
    id: 5,
    firstname: "hhi",
    lastname: "hhi",
    imgUrl: "https://naver.com",
    chons: [
      {
        id: 3,
        firstname: "asdfas",
        lastname: "adsf",
        imgUrl: "https://naver.com",
      },
      {
        id: 1,
        firstname: "asdf",
        lastname: "adsf",
        imgUrl: "https://naver.com",
      },
    ],
  },
];

const friendListStub3 = [
  {
    id: 2,
    firstname: "hi",
    lastname: "hi",
    imgUrl: "https://naver.com",
    chons: [
      { id: 3, firstname: "hi", lastname: "hi", imgUrl: "https://naver.com" },
      { id: 4, firstname: "hi", lastname: "hi", imgUrl: "https://naver.com" },
    ],
  },
  {
    id: 5,
    firstname: "hhi",
    lastname: "hhi",
    imgUrl: "https://naver.com",
    chons: [
      {
        id: 3,
        firstname: "asdfas",
        lastname: "adsf",
        imgUrl: "https://naver.com",
      },
      {
        id: 4,
        firstname: "asdf",
        lastname: "adsf",
        imgUrl: "https://naver.com",
      },
    ],
  },
];

const friendListStub4 = [
  {
    id: 5,
    firstname: "hi",
    lastname: "hi",
    imgUrl: "https://naver.com",
    chons: [],
  },
];

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
    renderProfilePage(
      profilePageUsersStub[0],
      friendListStub,
      currentProfileStub,
      alertProviderProps,
    );
  });

  it("tests useEffect branchign with different oneChon id", async () => {
    renderProfilePage(
      profilePageUsersStub[0],
      friendListStub4,
      currentProfileStub,
      alertProviderProps,
    );
  });

  it("tests onClickChangeProfile", async () => {
    renderProfilePage(
      profilePageUsersStub[0],
      friendListStub,
      currentProfileStub,
      alertProviderProps,
    );
    const button = screen.getByText("프로필 수정");
    fireEvent.click(button);
  });

  it("tests onClickChatWithUser", async () => {
    renderProfilePage(
      profilePageUsersStub[1],
      friendListStub,
      currentProfileStub,
      alertProviderProps,
    );
    const button = screen.getByText("채팅하기");
    fireEvent.click(button);
  });

  it("tests onClickEvaluateQuality", async () => {
    renderProfilePage(
      profilePageUsersStub[1],
      friendListStub,
      currentProfileStub,
      alertProviderProps,
    );
    const button = screen.getByText("동료로서 평가하기");
    fireEvent.click(button);
  });

  it("tests onClickAddFriend success", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => {},
    });
    renderProfilePage(
      profilePageUsersStub[1],
      friendListStub2,
      currentProfileStub,
      alertProviderProps,
    );
    const button = screen.getByText("친구 추가하기");
    fireEvent.click(button);
  });

  it("tests onClickAddFriend failure", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    renderProfilePage(
      profilePageUsersStub[1],
      friendListStub2,
      currentProfileStub,
      alertProviderProps,
    );
    const button = screen.getByText("친구 추가하기");
    fireEvent.click(button);
  });

  it("tests getFriendProfileDataNoStateUpdate", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({ ...profileStub }),
    });
    renderProfilePage(
      profilePageUsersStub[0],
      friendListStub3,
      currentProfileStub,
      alertProviderProps,
    );
  });
  it("tests alert callback", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <MemoryRouter>
            <Routes>
              <Route path="/:userId" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/1" />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      </AlertContextProvider>,
    );
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    await screen.findByRole("button", { name: "확인" });

    const modalButton = screen.getByRole("button", { name: "확인" });
    fireEvent.click(modalButton);
  });
  it("tests null useParam userID", async () => {
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>,
    );
  });
});
