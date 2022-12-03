/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { EditProfileDto } from "server/dto/profile/profile.dto";
import {
  EditProfileResDto,
  GetProfileResDto,
} from "server/dto/profile/profile.res.dto";
import { Profile } from "server/models/profile.model";
import { QualityTags } from "server/models/qualityTags.model";

export type ProfileState = {
  currentProfile: (Profile & { qualityTags: QualityTags | null }) | null;
  previewProfile:
    | (Profile & { qualityTags: QualityTags | null; id: number })
    | null;
};

const initialState: ProfileState = {
  currentProfile: null,
  previewProfile: null,
};

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
  EditProfileDto
>("profile/editMyProfile", async (profile: EditProfileDto) => {
  const response = await axios.put<EditProfileResDto>("/api/profile/", {
    ...profile,
  });
  return response.data;
});

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setPreviewProfile: (state, action) => {
      state.previewProfile = action.payload;
    },
  },
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
