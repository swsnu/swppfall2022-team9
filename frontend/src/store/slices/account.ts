import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  PostPasswordDto,
  PostPasswordUnauthenticatedDto,
} from "server/dto/account/account.dto";
import { PostPasswordResDto } from "server/dto/account/account.res.dto";

// we do not need anything for account slice
const initialState = undefined;

export const postPasswordUnauthenticated = createAsyncThunk<
  PostPasswordResDto,
  PostPasswordUnauthenticatedDto
>("account/postPasswordUnauthenticated", async ({ token, password }) => {
  const body: PostPasswordUnauthenticatedDto = { token, password };
  const response = (
    await axios.post<PostPasswordUnauthenticatedDto>(
      "/api/account/password/token/",
      body,
    )
  ).data;
  // there is a return here since we should use unwrap for checking wheter the token is correct
  return response;
});

export const postPassword = createAsyncThunk<
  PostPasswordResDto,
  PostPasswordDto
>("account/postPasswordUnauthenticated", async ({ password }) => {
  const body: PostPasswordDto = { password };
  const response = (
    await axios.post<PostPasswordResDto>("/api/account/password/", body)
  ).data;
  // there is a return here since we should use unwrap for checking wheter the token is correct
  return response;
});

// TODO: Implement other slices

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
});
