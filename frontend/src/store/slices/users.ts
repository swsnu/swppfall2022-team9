/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PostCreateProfileDto } from "server/dto/profile/profile.dto";
import { PostSignInDto, PostSignUpDto } from "server/dto/users/users.dto";
import {
  GetChonListResDto,
  PostSignInResDto,
  PostSignUpResDto,
} from "server/dto/users/users.res.dto";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/chon.types";

export const acceptedLoginInfo: PostSignInDto = {
  username: "swppsnu",
  password: "iluvswpp",
};

export type UserState = {
  currentUser: User | null;
  chonList: OneChonInfo[];
};

const initialState: UserState = {
  currentUser: null,
  chonList: [],
};

export const postSignIn = createAsyncThunk<void, PostSignInDto>(
  "users/postSignIn",
  //you can test with swpp@snu.ac.kr
  async body => {
    await axios.post<PostSignInResDto>("/api/auth/signin/", body);
  },
);

export const postSignUp = createAsyncThunk<PostSignUpResDto, PostSignUpDto>(
  "users/postSignUp",
  async body => {
    const response = (
      await axios.post<PostSignUpResDto>("/api/auth/signup/", body)
    ).data;
    return response;
  },
);

export const putSignOut = createAsyncThunk<void>(
  "users/putSignOut",
  async (_, { dispatch }) => {
    await axios.get(`/api/auth/signout/`);
    dispatch(userActions.resetCurrentUser());
  },
);

export const verifyRegisterToken = createAsyncThunk<void, string>(
  "users/verifyRegisterToken",
  async token => {
    await axios.get(`/api/auth/verify/${token}/`);
  },
);

export const getChonList = createAsyncThunk<void>(
  "users/getChonList",
  async (_, { dispatch }) => {
    const response = (await axios.get<GetChonListResDto>(`/api/user/onechon/`))
      .data;
    dispatch(userActions.setChonList(response.onechon));
  },
);

export const postCreateProfile = createAsyncThunk<void, PostCreateProfileDto>(
  "users/postCreateProfile",
  async body => {
    await axios.post<PostCreateProfileDto>("/api/profile", body);
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
    setChonList: (state, actions: PayloadAction<Array<OneChonInfo>>) => {
      state.chonList = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;

// TODO post profile
