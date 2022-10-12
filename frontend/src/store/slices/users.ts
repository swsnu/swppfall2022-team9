import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PutSignOutDto, PostSignInDto } from "dto/users/users.dto";
import {
  GetUserResDto,
  PostSignInResDto,
  PutSignOutResDto,
} from "dto/users/users.res.dto";
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
  extraReducers(builder) {},
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export const postSiginIn = createAsyncThunk<void, PostSignInDto>(
  "users/postSignIn",
  async ({ email, password }, { dispatch }) => {
    if (
      email === acceptedLoginInfo.email &&
      password === acceptedLoginInfo.password
    ) {
      const user = (await axios.get<GetUserResDto>("/api/user/1")).data;
      const loggedInUser = (
        await axios.put<PostSignInResDto>("/api/user/1", {
          ...user,
          logged_in: true,
        } as User)
      ).data;
      dispatch(userActions.setCurrentUser(loggedInUser));
    }
  },
);

export const putSignOut = createAsyncThunk<void, PutSignOutDto>(
  "users/putSignOut",
  async (user, { dispatch }) => {
    const data: PutSignOutDto = { ...user, logged_in: false };
    await axios.put<PutSignOutResDto>(`/api/user/${user.id}`, data);
    dispatch(userActions.resetCurrentUser());
  },
);

export default userSlice.reducer;
