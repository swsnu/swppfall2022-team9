import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GetAllSkillTagsResDto } from "server/dto/skillTags/skillTags.res.dto";

export const getAllSkillTags = createAsyncThunk<
  GetAllSkillTagsResDto,
  void
>("qualities/getAllQualityTags", async () => {
  const response = await axios.get<GetAllSkillTagsResDto>(
    "/api/skillTags/",
  );
  return response.data;
});