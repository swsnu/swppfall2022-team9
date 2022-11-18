/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PostSignInDto, PostSignUpDto } from "server/dto/users/users.dto";
import {
  GetFriendListResDto,
  PostSignInResDto,
  PostSignUpResDto,
} from "server/dto/users/users.res.dto";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/friend.types";

export const acceptedLoginInfo: PostSignInDto = {
  username: "swppsnu",
  password: "iluvswpp",
};

export type UserState = {
  currentUser: User | null;
  friendList: OneChonInfo[];
};

const initialState: UserState = {
  currentUser: null,
  friendList: [],
};

// DESC: this is for checking if user is logged in
export const getSessionCookie = createAsyncThunk<void>(
  "users/getSessionCookie",
  //you can test with swpp@snu.ac.kr
  async (_, { dispatch }) => {
    const response = (await axios.get<PostSignInResDto>("/api/auth/session/"))
      .data;
    dispatch(userActions.setCurrentUser(response));
  },
);

export const postSignIn = createAsyncThunk<void, PostSignInDto>(
  "users/postSignIn",
  //you can test with swpp@snu.ac.kr
  async (body, { dispatch }) => {
    const response = (
      await axios.post<PostSignInResDto>("/api/auth/signin/", body)
    ).data;
    dispatch(userActions.setCurrentUser(response));
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
  async (_, { dispatch }) => {
    await axios.get(`/api/auth/signout/`);
    dispatch(userActions.resetCurrentUser());
    dispatch(userActions.resetFriendList());
  },
);

export const verifyRegisterToken = createAsyncThunk<void, string>(
  "users/verifyRegisterToken",
  async token => {
    await axios.post(`/api/auth/verify/${token}/`);
  },
);

export const getFriendList = createAsyncThunk<void>(
  "users/getFriendList",
  async (_, { dispatch }) => {
    const response = (await axios.get<GetFriendListResDto>(`/api/user/friend/`))
      .data;
    dispatch(userActions.setFriendList(response.friendList));
  },
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, actions: PayloadAction<User>) => {
      state.currentUser = actions.payload;
    },
    resetCurrentUser: state => {
      state.currentUser = null;
    },
    setFriendList: (state, actions: PayloadAction<Array<OneChonInfo>>) => {
      state.friendList = actions.payload;
    },
    resetFriendList: state => {
      state.friendList = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
