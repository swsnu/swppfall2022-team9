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
  PostCreateProfileResDto,
} from "server/dto/profile/profile.res.dto";
import { Profile } from "server/models/profile.model";

export type ProfileState = {
  currentProfile: Profile | null;
};

const initialState: ProfileState = {
  currentProfile: null,
};

export const postCreateProfile = createAsyncThunk<
  PostCreateProfileResDto,
  PostCreateProfileDto
>("profile/postCreateProfile", async profile => {
  const body: PostCreateProfileDto = profile;
  const response = await axios.post<PostCreateProfileResDto>(
    "/api/profile/",
    body,
  );
  return response.data;
});

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
  { profile: Profile; fieldsToUpdate: EditProfileDto }
>("profile/editMyProfile", async ({ profile, fieldsToUpdate }) => {
  const response = await axios.put<EditProfileResDto>("/api/profile/", {
    ...profile,
    ...fieldsToUpdate,
  });
  return response.data;
});

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      state.currentProfile = action.payload.profile;
    });
    builder.addCase(getFriendProfile.fulfilled, (state, action) => {
      state.currentProfile = action.payload.profile;
    });
    builder.addCase(editMyProfile.fulfilled, (state, action) => {
      state.currentProfile = action.payload.profile;
    });
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
