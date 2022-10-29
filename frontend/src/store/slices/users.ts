/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PostSignInDto, PostSignUpDto } from "dto/users/users.dto";
import { PostSignInResDto, PostSignUpResDto } from "dto/users/users.res.dto";
import { User } from "models/users.model";

export const acceptedLoginInfo: PostSignInDto = {
  email: "swpp@snu.ac.kr",
  password: "iluvswpp",
};

export type UserState = {
  currentUser: User | null;
};

const initialState: UserState = {
  currentUser: null,
};

export const postSignIn = createAsyncThunk<void, PostSignInDto>(
  "users/postSignIn",
  //you can test with swpp@snu.ac.kr
  async body => {
    await axios.post<PostSignInResDto>("/api/login", body);
  },
);

export const postSignUp = createAsyncThunk<PostSignUpResDto, PostSignUpDto>(
  "users/postSignUp",
  async body => {
    const response = (await axios.post<PostSignUpResDto>("/api/signup", body))
      .data;
    return response;
  },
);

export const putSignOut = createAsyncThunk<void>(
  "users/putSignOut",
  async (_, { dispatch }) => {
    await axios.get(`/api/logout`);
    dispatch(userActions.resetCurrentUser());
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
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extraReducers(builder) {},
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
