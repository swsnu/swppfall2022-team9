import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/friend.types";
import { Profile } from "server/models/profile.model";
import { QualityTags } from "server/models/qualityTags.model";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { profileStub, profileStub2 } from "server/stubs/profiles.stub";
import { friendListStub, usersStub } from "server/stubs/users.stub";
import { screen, fireEvent, act } from "@testing-library/react";
import { qualityTagStub } from "server/stubs/qualityTags.stub";
import { friendRequestsStub } from "server/stubs/friendRequests.stub";
import PreviewProfileSidebar from "./PreviewProfileSidebar";

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

window.scrollTo = jest.fn();

const renderPreviewProfileSidebar = (
  currentUser: User | null,
  friendList: OneChonInfo[],
  currentProfile: (Profile & { qualityTags: QualityTags }) | null,
  previewProfile:
    | (Profile & { qualityTags: QualityTags | null; id: number })
    | null,
  oneChonIdToExpandNetwork: number | null,
  alertProviderProps?: AlertContextProps,
) => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<PreviewProfileSidebar />} />
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
          previewProfile,
        },
        friendRequests: {
          friendRequestToken: null,
          friendRequests: [
            { ...friendRequestsStub[0], senderImgUrl: "", senderName: "" },
            { ...friendRequestsStub[5], senderImgUrl: "", senderName: "" },
          ],
        },
        canvas: {
          oneChonIdToExpandNetwork: oneChonIdToExpandNetwork,
          isPanZoomed: false,
        },
      },
    },
    alertProviderProps,
  );
};

describe("<PreviewProfileSidebar/>", () => {
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

  it("renders PreviewProfileSidebar", async () => {
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        null,
        null,
        null,
        alertProviderProps,
      );
    });
  });

  it("renders PreviewProfileSidebar with profile", async () => {
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[0],
        friendListStub,
        null,
        { ...profileStub, qualityTags: qualityTagStub, id: 1 },
        1,
        alertProviderProps,
      );
    });
  });

  it("renders PreviewProfileSidebar with current profile", async () => {
    await act(async () => {
      renderPreviewProfileSidebar(
        usersStub[1],
        friendListStub,
        { ...profileStub2, qualityTags: qualityTagStub },
        { ...profileStub, qualityTags: qualityTagStub, id: 1 },
        1,
        alertProviderProps,
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
        { ...profileStub2, qualityTags: qualityTagStub },
        { ...profileStub, qualityTags: qualityTagStub, id: 1 },
        1,
        alertProviderProps,
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
        { ...profileStub2, qualityTags: qualityTagStub },
        { ...profileStub, qualityTags: qualityTagStub, id: 8 },
        null,
        alertProviderProps,
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
        { ...profileStub2, qualityTags: qualityTagStub },
        { ...profileStub, qualityTags: qualityTagStub, id: 8 },
        1,
        alertProviderProps,
      );
    });
    const button = screen.getByRole("expand_network");
    fireEvent.click(button);
  });
});
