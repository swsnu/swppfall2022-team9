import { renderWithProviders } from "test-utils/mocks";
import {
  waitFor,
  screen,
  fireEvent,
  render,
  act,
} from "@testing-library/react";
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
import { friendListStub, usersStub } from "server/stubs/users.stub";
import { Provider } from "react-redux";
import store from "store";
import { friendRequestsStub } from "server/stubs/friendRequests.stub";

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
  userId: number,
  alertProviderProps?: AlertContextProps,
) => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/:userId" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to={`/${userId}`} />} />
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
        friendRequests: {
          friendRequestToken: null,
          friendRequests: [
            { ...friendRequestsStub[0], senderImgUrl: "", senderName: "" },
            { ...friendRequestsStub[5], senderImgUrl: "", senderName: "" },
          ],
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

describe("<ProfilePage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
    mockDispatch.mockReturnValue({
      unwrap: () => ({ ...profileStub }),
    });
  });

  it("renders profile page", async () => {
    await act(async () => {
      renderProfilePage(
        usersStub[0],
        friendListStub,
        null,
        1,
        alertProviderProps,
      );
    });
  });

  it("tests onClickChangeProfile", async () => {
    await act(async () => {
      renderProfilePage(
        usersStub[0],
        friendListStub,
        currentProfileStub,
        1,
        alertProviderProps,
      );
    });
    const button = screen.getByText("프로필 수정");
    fireEvent.click(button);
  });

  it("tests onClickChatWithUser", async () => {
    await act(async () => {
      renderProfilePage(
        usersStub[0],
        friendListStub,
        currentProfileStub,
        8,
        alertProviderProps,
      );
    });
    const button = screen.getByText("채팅하기");
    fireEvent.click(button);
  });

  it("tests onClickEvaluateQuality", async () => {
    await act(async () => {
      renderProfilePage(
        usersStub[0],
        friendListStub,
        currentProfileStub,
        8,
        alertProviderProps,
      );
    });
    const button = screen.getByText("동료로서 평가하기");
    fireEvent.click(button);
  });

  it("tests onClickAddFriend success", async () => {
    await act(async () => {
      renderProfilePage(
        usersStub[0],
        friendListStub,
        currentProfileStub,
        9,
        alertProviderProps,
      );
    });
    const button = screen.getByText("친구 추가하기");
    fireEvent.click(button);
  });

  it("tests onClickAddFriend failure", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    await act(async () => {
      renderProfilePage(
        usersStub[0],
        friendListStub,
        currentProfileStub,
        9,
        alertProviderProps,
      );
    });
    const button = screen.getByText("친구 추가하기");
    fireEvent.click(button);
  });

  it("tests getFriendProfileDataNoStateUpdate", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    await act(async () => {
      renderProfilePage(
        usersStub[0],
        friendListStub,
        currentProfileStub,
        8,
        alertProviderProps,
      );
    });
  });

  it("tests uncovered branches", async () => {
    await act(async () => {
      renderProfilePage(
        usersStub[0],
        friendListStub,
        currentProfileStub,
        4,
        alertProviderProps,
      );
    });
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
