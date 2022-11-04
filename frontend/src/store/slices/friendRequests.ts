import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  PostFriendRequestDto,
  PutFriendRequestDto,
} from "server/dto/friendRequests/friendRequests.dto";
import {
  GetFriendRequestsResDto,
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
export const getFriendRequests = createAsyncThunk<GetFriendRequestsResDto>(
  "friendRequests/getFriendRequests",
  async () => {
    const response = await axios.get<GetFriendRequestsResDto>(
      "/api/friendRequest",
    );
    return response.data;
  },
);

/**
 * This is for Creating a friend request
 * (the current user sends a friend request to twoChon)
 */
export const postFriendRequest = createAsyncThunk<void, PostFriendRequestDto>(
  "friendRequests/postFriendRequest",
  async ({ senderId, getterId }) => {
    const data: PostFriendRequestDto = { senderId, getterId };
    await axios.post<PostFriendRequestResDto>("/api/friendRequest", data);
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
    `/api/friendRequest/${id}`,
    data,
  );
  return response.data;
});

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
  },
  extraReducers(builder) {
    builder.addCase(getFriendRequests.fulfilled, (state, action) => {
      state.friendRequests = action.payload.friendRequests;
    });
    builder.addCase(putFriendRequest.fulfilled, (state, action) => {
      // WARNING: This is not yet decided!
      // The may change according to how the backend is implemented

      // DESC: A friend request can change to either 'ACCEPTED' or 'REJECTED'
      // Either way, the friend request should be deleted from the list
      state.friendRequests = state.friendRequests.filter(
        friendRequest => friendRequest.id !== action.payload.friendRequest.id,
      );
    });
  },
});

export const friendRequestActions = friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;
