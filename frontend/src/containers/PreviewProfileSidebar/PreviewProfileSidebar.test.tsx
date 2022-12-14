import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/friend.types";
import { Profile } from "server/models/profile.model";
import { QualityTags } from "server/models/qualityTags.model";
import {
  AlertContextProps,
  AlertContextProvider,
} from "containers/Context/AlertContext/AlertContext";
import { profileStub, profileStub2 } from "server/stubs/profiles.stub";
import { friendListStub, usersStub } from "server/stubs/users.stub";
import { screen, fireEvent, act, render } from "@testing-library/react";
import { qualityTagStub } from "server/stubs/qualityTags.stub";
import { friendRequestsStub } from "server/stubs/friendRequests.stub";
import PreviewProfileSidebar from "./PreviewProfileSidebar";
import { Provider } from "react-redux";
import { setupStore } from "store/slices";
import axios from "axios";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

window.scrollTo = jest.fn();

const renderPreviewProfileSidebar = (
  currentUser: User | null,
  friendList: OneChonInfo[],
  previewProfile:
    | (Profile & { qualityTags: QualityTags | null; id: number })
    | null,
  oneChonIdToExpandNetwork: number | null,
) => {
  return render(
    <AlertContextProvider>
      <Provider
        store={setupStore({
          users: {
            currentUser,
            friendList,
          },
          profile: {
            currentProfile: null,
            previewProfile,
          },
          canvas: {
            oneChonIdToExpandNetwork: oneChonIdToExpandNetwork,
            isPanZoomed: false,
          },
        })}
      >
        <PreviewProfileSidebar />
      </Provider>
    </AlertContextProvider>,
  );
};

describe("<PreviewProfileSidebar/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders PreviewProfileSidebar", async () => {
    await act(async () => {
      renderPreviewProfileSidebar(usersStub[0], friendListStub, null, null);
    });
    const viewProfileButton = screen.getByText("프로필 보기");
    fireEvent.click(viewProfileButton);
  });

  it("renders PreviewProfileSidebar with profile", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: friendRequestsStub[0] });
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 1 },
        1,
      );
    });
  });

  it("tests getExistingFriendRequest error", async () => {
    axios.get = jest.fn().mockRejectedValueOnce({});
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 1 },
        1,
      );
    });
  });

  it("renders PreviewProfileSidebar with current profile", async () => {
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[1],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 1 },
        1,
      );
    });
    const button = screen.getByRole("add_friend");
    fireEvent.click(button);
  });

  it("tests view profile", async () => {
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 1 },
        1,
      );
    });
    const button = screen.getByRole("view_profile");
    fireEvent.click(button);
  });

  it("tests expand network on null", async () => {
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[1],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 8 },
        null,
      );
    });
    const button = screen.getByRole("expand_network");
    fireEvent.click(button);
    const button2 = screen.getByRole("delete_friend");
    fireEvent.click(button2);
  });

  it("tests expand network", async () => {
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[1],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 8 },
        1,
      );
    });
    const button = screen.getByRole("expand_network");
    fireEvent.click(button);
  });

  it("tests findUserName with two chon", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: friendRequestsStub[0] });
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 17 },
        1,
      );
    });
  });

  it("tests delete friend", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: friendRequestsStub[7] });
    axios.put = jest.fn().mockResolvedValueOnce({});
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 8 },
        1,
      );
    });

    const deleteButton = screen.getByRole("delete_friend");
    fireEvent.click(deleteButton);
    await screen.findByText("정말로 친구를 끊으시겠습니까?");
    const confirmButton = screen.getByText("예");
    fireEvent.click(confirmButton);
  });

  it("tests delete friend error", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: friendRequestsStub[7] });
    axios.put = jest.fn().mockRejectedValueOnce({});
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 8 },
        1,
      );
    });

    const deleteButton = screen.getByRole("delete_friend");
    fireEvent.click(deleteButton);
    await screen.findByText("정말로 친구를 끊으시겠습니까?");
    const confirmButton = screen.getByText("예");
    fireEvent.click(confirmButton);
    await screen.findByText("친구 삭제에 실패했습니다");
  });

  it("tests add friend", async () => {
    axios.get = jest.fn().mockRejectedValueOnce({});
    axios.post = jest.fn().mockResolvedValueOnce({});
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 17 },
        1,
      );
    });

    const addButton = screen.getByRole("add_friend");
    fireEvent.click(addButton);
    await screen.findByText("친구 요청을 보냈습니다");
  });

  it("tests add friend disabled", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: friendRequestsStub[8] });
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub, qualityTags: qualityTagStub, id: 17 },
        1,
      );
    });
  });

  it("tests add friend disabled2", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: friendRequestsStub[9] });
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        { ...profileStub2, qualityTags: qualityTagStub, id: 19 },
        1,
      );
    });
  });
});
