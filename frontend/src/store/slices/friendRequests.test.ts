import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import {
  friendRequestActions,
  FriendRequestState,
  getFriendRequestBetweenUsers,
  getFriendRequests,
  postFriendRequest,
  putFriendRequest,
} from "./friendRequests";
import friendRequestReducer from "./friendRequests";
import axios from "axios";
import { friendRequestsStub } from "server/stubs/friendRequests.stub";
import { FriendRequestStatus } from "server/models/friendRequests.model";

describe("friend request reducer", () => {
  let store: EnhancedStore<
    { friendRequests: FriendRequestState },
    AnyAction,
    [
      ThunkMiddleware<
        { friendRequests: FriendRequestState },
        AnyAction,
        undefined
      >,
    ]
  >;
  beforeAll(() => {
    store = configureStore({
      reducer: { friendRequests: friendRequestReducer },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle initial state", () => {
    expect(friendRequestReducer(undefined, { type: "unknown" })).toEqual({
      friendRequestToken: null,
      friendRequests: [],
    });
  });

  it("tests get friend requests", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        friendRequests: [
          {
            ...friendRequestsStub[0],
            senderName: "test",
            senderImgUrl: "test",
          },
        ],
      },
    });
    await store.dispatch(getFriendRequests({ user1Id: 1, user2Id: 2 }));
  });

  it("tests get friend requests without query", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        friendRequests: [
          {
            ...friendRequestsStub[0],
            senderName: "test",
            senderImgUrl: "test",
          },
        ],
      },
    });
    await store.dispatch(getFriendRequests());
  });

  it("tests get friend requests between users", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: friendRequestsStub[0],
    });
    await store.dispatch(
      getFriendRequestBetweenUsers({ user1Id: 1, user2Id: 2 }),
    );
  });

  it("tests post friend request", async () => {
    axios.post = jest.fn().mockResolvedValue({});
    await store.dispatch(
      postFriendRequest({ getterId: 2, senderImgUrl: "", senderName: "" }),
    );
  });

  it("tests put friend request", async () => {
    axios.put = jest
      .fn()
      .mockResolvedValue({ data: { friendRequest: friendRequestsStub[0] } });
    await store.dispatch(
      putFriendRequest({ id: 1, status: FriendRequestStatus.ACCEPTED }),
    );
    expect(store.getState().friendRequests.friendRequests.length).toEqual(1);
  });

  it("tests set friend request token", async () => {
    store.dispatch(friendRequestActions.setFriendRequestToken("test"));
  });

  it("tests reset friend requests", async () => {
    store.dispatch(friendRequestActions.resetFriendRequests());
  });
});
