/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GetProfileResDto } from "server/dto/profile/profile.res.dto";
import { PostSignInDto, PostSignUpDto } from "server/dto/users/users.dto";
import {
  GetFriendListResDto,
  PostSignInResDto,
  PostSignUpResDto,
} from "server/dto/users/users.res.dto";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/friend.types";

export type UserState = {
  currentUser: User | null;
  friendList: OneChonInfo[];
};

const initialState: UserState = {
  currentUser: null,
  friendList: [],
};

// DESC: this is for checking if user is logged in
export const getSessionCookie = createAsyncThunk<PostSignInResDto>(
  "users/getSessionCookie",
  async () => {
    const sessionResponse = await axios.get<PostSignInResDto>(
      "/api/auth/session/",
    );
    const profileResponse = await axios.get<GetProfileResDto>(
      `/api/profile/${sessionResponse.data.id}/`,
    );
    return { ...sessionResponse.data, imgUrl: profileResponse.data.imgUrl };
  },
);

export const postSignIn = createAsyncThunk<User, PostSignInDto>(
  "users/postSignIn",
  async body => {
    const signInResponse = await axios.post<PostSignInResDto>(
      "/api/auth/signin/",
      body,
    );
    const profileResponse = await axios.get<GetProfileResDto>(
      `/api/profile/${signInResponse.data.id}/`,
    );
    return { ...signInResponse.data, imgUrl: profileResponse.data.imgUrl };
  },
);

export const postSignUp = createAsyncThunk<void, PostSignUpDto>(
  "users/postSignUp",
  async body => {
    await axios.post<PostSignUpResDto>("/api/auth/signup/", body);
  },
);

export const getSignOut = createAsyncThunk<void>(
  "users/getSignOut",
  async () => {
    await axios.get(`/api/auth/signout/`);
  },
);

export const verifyRegisterToken = createAsyncThunk<void, string>(
  "users/verifyRegisterToken",
  async token => {
    await axios.post(`/api/auth/verify/${token}/`);
  },
);

export const getFriendList = createAsyncThunk<GetFriendListResDto>(
  "users/getFriendList",
  async () => {
    const response = await axios.get<GetFriendListResDto>(`/api/user/friend/`);
    return response.data;
  },
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getSessionCookie.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(postSignIn.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(getSignOut.fulfilled, state => {
      state.currentUser = null;
      state.friendList = [];
    });
    builder.addCase(getFriendList.fulfilled, (state, action) => {
      state.friendList = action.payload.friendList;
    });
  },
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
