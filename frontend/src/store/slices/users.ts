/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PostSignInDto, PostSignUpDto } from "dto/users/users.dto";
import { PostSignInResDto } from "dto/users/users.res.dto";
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

export const postSiginIn = createAsyncThunk<PostSignInResDto, PostSignInDto>(
  "users/postSignIn",
  //you can test with swpp@snu.ac.kr
  async (body, thunkApi) => {
    try {
      const response = (await axios.post<PostSignInResDto>("/login", body))
        .data;
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const postSignUp = createAsyncThunk<void, PostSignUpDto>(
  "users/postSignUp",
  async (body, { dispatch }) => {
    const response = (await axios.post<PostSignInResDto>("/api/signup", body))
      .data;
    dispatch(userActions.setCurrentUser(response));
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
  extraReducers(builder) {
    builder.addCase(postSiginIn.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(postSiginIn.rejected, (state, action) => {
      throw new Error(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
