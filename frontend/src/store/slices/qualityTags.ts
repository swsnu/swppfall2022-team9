/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  GetAllQualityTagsResDto,
  GetUserQualityTagsResDto,
  PutUserQualityTagsResDto,
} from "server/dto/qualityTags/qualityTags.res.dto";
import { QualityTags } from "server/models/qualityTags.model";
import { PutUserQualityTagsDto } from "server/dto/qualityTags/qualityTags.dto";

export type QualityTagsState = {
  currentUserQualityTags: QualityTags | null;
  skillTagsList: QualityTags | null;
};

const initialState: QualityTagsState = {
  currentUserQualityTags: null,
  skillTagsList: null,
};

export const getAllQualityTags = createAsyncThunk<
  GetAllQualityTagsResDto,
  void
>("qualities/getAllQualityTags", async () => {
  const response = await axios.get<GetAllQualityTagsResDto>("/api/qualities/");
  return response.data;
});

export const getUserQualityTags = createAsyncThunk<
  GetUserQualityTagsResDto,
  number
>("qualities/getUserQualityTags", async (id: number) => {
  const response = await axios.get<GetUserQualityTagsResDto>(
    `/api/qualities/${id}/`,
  );
  return response.data;
});

export const putUserQualityTags = createAsyncThunk<
  PutUserQualityTagsResDto,
  PutUserQualityTagsDto & { id: number }
>("qualities/getFriendProfile", async ({ qualityTags, id }) => {
  const data: PutUserQualityTagsDto = { qualityTags };
  const response = await axios.put<PutUserQualityTagsResDto>(
    `/api/qualities/${id}/`,
    data,
  );
  return response.data;
});

export const qualityTagsSlice = createSlice({
  name: "qualityTags",
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllQualityTags.fulfilled, (state, action) => {
      state.skillTagsList = action.payload.qualityTags;
    });
    builder.addCase(getUserQualityTags.fulfilled, (state, action) => {
      state.currentUserQualityTags = action.payload.qualityTags;
    });
    builder.addCase(putUserQualityTags.fulfilled, (state, action) => {
      state.currentUserQualityTags = action.payload.qualityTags;
    });
  },
});

export const qualitiesActions = qualityTagsSlice.actions;
export default qualityTagsSlice.reducer;
