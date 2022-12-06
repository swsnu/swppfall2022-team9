import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  PostFriendRequestDto,
  PutFriendRequestDto,
} from "server/dto/friendRequests/friendRequests.dto";
import {
  GetFriendRequestsResDto,
  GetFriendRequestTokenResDto,
  PostFriendRequestResDto,
  PutFriendRequestResDto,
} from "server/dto/friendRequests/friendRequests.res.dto";
import { FriendRequest } from "server/models/friendRequests.model";

export type FriendRequestState = {
  friendRequestToken: string | null;
  friendRequests: Array<
    FriendRequest & { senderImgUrl: string; senderName: string }
  >;
};

const initialState: FriendRequestState = {
  friendRequestToken: null,
  friendRequests: [],
};

/**
 * This gets all the new friend requests for the current user
 */
export const getFriendRequests = createAsyncThunk<
  GetFriendRequestsResDto,
  { user1Id: number; user2Id: number } | undefined
>("friendRequests/getFriendRequests", async query => {
  const response = await axios.get<GetFriendRequestsResDto>(
    "/api/friendRequest/",
    query ? { params: query } : undefined,
  );
  return response.data;
});

/**
 * This gets a specific friendRequest between two users
 */
export const getFriendRequestBetweenUsers = createAsyncThunk<
  FriendRequest,
  { friendId1: number; friendId2: number }
>("friendRequests/getFriendRequestBetweenUsers", async query => {
  const response = await axios.get<FriendRequest>("/api/friendRequest/", {
    params: query,
  });
  return response.data;
});

/**
 * This is for Creating a friend request
 * (the current user sends a friend request to twoChon)
 */
export const postFriendRequest = createAsyncThunk<
  PostFriendRequestResDto & { senderImgUrl: string; senderName: string },
  PostFriendRequestDto & { senderImgUrl: string; senderName: string }
>(
  "friendRequests/postFriendRequest",
  async ({ getterId, senderImgUrl, senderName }) => {
    const data: PostFriendRequestDto = { getterId };
    const response = await axios.post<PostFriendRequestResDto>(
      "/api/friendRequest/",
      data,
    );
    return { ...response.data, senderImgUrl, senderName };
  },
);

/**
 * This is for Accepting or Rejecting a friend request
 */
export const putFriendRequest = createAsyncThunk<
  PutFriendRequestResDto,
  PutFriendRequestDto & { id: number }
>("friendRequests/putFriendRequest", async ({ id, status }) => {
  const data: PutFriendRequestDto = { status };
  const response = await axios.put<PutFriendRequestResDto>(
    `/api/friendRequest/${id}/`,
    data,
  );
  return response.data;
});

/**
 * This is for getting a friend request token
 */
export const getFriendRequestToken =
  createAsyncThunk<GetFriendRequestTokenResDto>(
    "friendRequest/getFriendRequestToken",
    async () => {
      const response = await axios.get<GetFriendRequestTokenResDto>(
        "/api/user/friendRequestToken/",
      );
      return response.data;
    },
  );

/**
 * This is for creating friend request with friend request token invite
 */
export const putFriendRequestToken = createAsyncThunk<void, string>(
  "friendRequest/putFriendRequestToken",
  async token => {
    await axios.put(`/api/friendRequestToken/?token=${token}`);
  },
);

/**
 * This is friend request slice
 */
export const friendRequestsSlice = createSlice({
  name: "friendRequests",
  initialState,
  reducers: {
    setFriendRequestToken: (state, actions: PayloadAction<string>) => {
      state.friendRequestToken = actions.payload;
    },
    resetFriendRequests: state => {
      state.friendRequests = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(getFriendRequests.fulfilled, (state, action) => {
      state.friendRequests = action.payload.friendRequests;
    });
    builder.addCase(postFriendRequest.fulfilled, (state, action) => {
      state.friendRequests.push(action.payload);
    });
    builder.addCase(putFriendRequest.fulfilled, (state, action) => {
      // DESC: A friend request can change to either 'ACCEPTED' or 'REJECTED'
      // Either way, the friend request should be deleted from the list
      state.friendRequests = state.friendRequests.filter(
        friendRequest => friendRequest.id !== action.payload.id,
      );
    });
  },
});

export const friendRequestActions = friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;
