/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { PostCreateProfileDto } from "server/dto/profile/profile.dto";
import { GetProfileResDto } from "server/dto/profile/profile.res.dto";
import { Profile } from "server/models/profile.model";

export type CurrentUserProfile = {
  currentProfile: Profile | null;
};

const initialState: CurrentUserProfile = {
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

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {},
});
