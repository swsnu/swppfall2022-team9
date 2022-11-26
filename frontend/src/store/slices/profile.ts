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
import { QualityTags } from "server/models/qualityTags.model";

export type ProfileState = {
  currentProfile: (Profile & { qualityTags: QualityTags | null }) | null;
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

export const getProfile = createAsyncThunk<GetProfileResDto, number>(
  "profile/getProfile",
  async (id: number) => {
    const response = await axios.get<GetProfileResDto>(`/api/profile/${id}/`);
    return response.data;
  },
);

export const getFriendProfileWithoutStateUpdate = createAsyncThunk<
  GetProfileResDto,
  number
>("profile/getFriendProfileWithoutStateUpdate", async (id: number) => {
  const response = await axios.get<GetProfileResDto>(`/api/profile/${id}/`);
  return response.data;
});

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
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.currentProfile = action.payload;
    });
    builder.addCase(editMyProfile.fulfilled, (state, action) => {
      state.currentProfile = action.payload;
    });
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
