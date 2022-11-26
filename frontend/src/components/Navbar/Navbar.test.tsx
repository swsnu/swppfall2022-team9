import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  FriendRequest,
  FriendRequestStatus,
} from "server/models/friendRequests.model";
import { usersStub } from "server/stubs/users.stub";
import { renderWithProviders } from "test-utils/mocks";
import Navbar from "./Navbar";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  //useDispatch만 우리가 mocking
  useDispatch: () => mockDispatch,
}));

const renderNavbar = (
  friendRequests: Array<
    FriendRequest & { senderImgUrl: string; senderName: string }
  >,
) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Navbar />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: usersStub[0],
          friendList: [],
        },
        friendRequests: {
          friendRequests: friendRequests,
          friendRequestToken: null,
        },
      },
    },
  );
};

describe("<Navbar/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Navbar with no friend request", async () => {
    renderNavbar([]);
  });

  it("clicks navigations and etc", async () => {
    renderNavbar([]);
    const accountButton = screen.getByRole("account");
    fireEvent.click(accountButton);
    expect(mockNavigate).toHaveBeenCalled();
    const chatsButton = screen.getByRole("chats");
    fireEvent.click(chatsButton);
    expect(mockNavigate).toHaveBeenCalled();
    const logoImage = screen.getByRole("logo");
    fireEvent.click(logoImage);
    expect(mockNavigate).toHaveBeenCalled();
    const searchButton = screen.getByRole("search");
    // TODO: search click should render a search bar in the canvas!!
    fireEvent.click(searchButton);
  });

  it("clicks notification", async () => {
    renderNavbar([
      {
        id: 1,
        senderId: 2,
        getterId: 1,
        status: FriendRequestStatus.PENDING,
        senderImgUrl: "test",
        senderName: "test",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        senderId: 3,
        getterId: 1,
        status: FriendRequestStatus.PENDING,
        senderImgUrl: "",
        senderName: "test2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        senderId: 1,
        getterId: 4,
        status: FriendRequestStatus.PENDING,
        senderImgUrl: "",
        senderName: "test3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    const notificationButton = screen.getByRole("notification");
    fireEvent.click(notificationButton);
    const acceptButton = await waitFor(() => screen.getAllByText("수락")[0]);
    const rejectButton = await waitFor(() => screen.getAllByText("거절")[0]);
    fireEvent.click(acceptButton);
    expect(mockDispatch).toHaveBeenCalled();
    fireEvent.click(rejectButton);
    expect(mockDispatch).toHaveBeenCalled();
    // click somewhere else
    const accountButton = screen.getByRole("account");
    fireEvent.click(accountButton);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
  });
});
