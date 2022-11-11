/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  GetAllQualityTagsResDto,
  GetUserQualityTagsResDto,
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
>("qualities/getMyProfile", async (id: number) => {
  const response = await axios.get<GetUserQualityTagsResDto>(
    `/api/qualities/${id}`,
  );
  return response.data;
});

export const putUserQualityTags = createAsyncThunk<
  void,
  { body: PutUserQualityTagsDto; id: number }
>("qualities/getFriendProfile", async ({ body, id }) => {
  await axios.put<PutUserQualityTagsDto>(`/api/qualities/${id}`, body);
});

export const qualityTagsSlice = createSlice({
  name: "qualityTags",
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllQualityTags.fulfilled, (state, action) => {
      state.skillTagsList = action.payload;
    });
    builder.addCase(getUserQualityTags.fulfilled, (state, action) => {
      state.currentUserQualityTags = action.payload;
    });
  },
});

export const qualitiesActions = qualityTagsSlice.actions;
export default qualityTagsSlice.reducer;
