/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  PostCreateProfileDto,
  EditProfileDto,
} from "server/dto/profile/profile.dto";
import {
  EditProfileResDto,
  GetProfileResDto,
} from "server/dto/profile/profile.res.dto";
import { Profile } from "server/models/profile.model";

export type ProfileState = {
  currentProfile: Profile | null;
};

const initialState: ProfileState = {
  currentProfile: null,
};

export const postCreateProfile = createAsyncThunk<void, PostCreateProfileDto>(
  "profile/postCreateProfile",
  async () => {
    await axios.post<PostCreateProfileDto>("/api/profile/");
  },
);

export const getMyProfile = createAsyncThunk<GetProfileResDto, void>(
  "profile/getMyProfile",
  async () => {
    const response = await axios.get<GetProfileResDto>("/api/profile/");
    return response.data;
  },
);

export const getFriendProfile = createAsyncThunk<GetProfileResDto, number>(
  "profile/getFriendProfile",
  async (id: number) => {
    const response = await axios.get<GetProfileResDto>(`/api/profile/${id}`);
    return response.data;
  },
);

export const editMyProfile = createAsyncThunk<
  EditProfileResDto,
  EditProfileDto
>("profile/editMyProfile", async (body: EditProfileDto) => {
  const response = await axios.put<EditProfileResDto>("/api/profile/", body);
  return response.data;
});

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      state.currentProfile = action.payload;
    });
    builder.addCase(getFriendProfile.fulfilled, (state, action) => {
      state.currentProfile = action.payload;
    });
    builder.addCase(editMyProfile.fulfilled, (state, action) => {
      state.currentProfile = action.payload;
    });
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
