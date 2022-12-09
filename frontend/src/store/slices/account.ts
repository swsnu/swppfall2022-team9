import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  PutPasswordDto,
  PostPasswordUnauthenticatedDto,
  PutAccountDto,
} from "server/dto/account/account.dto";
import { PutPasswordResDto } from "server/dto/account/account.res.dto";

// we do not need anything for account slice

export interface AccountState {}
const initialState: AccountState = {};

export const postPasswordUnauthenticated = createAsyncThunk<
  PutPasswordResDto,
  PostPasswordUnauthenticatedDto
>("account/postPasswordUnauthenticated", async ({ token, newPassword }) => {
  const body: PostPasswordUnauthenticatedDto = { token, newPassword };
  const response = (
    await axios.post<PostPasswordUnauthenticatedDto>(
      "/api/account/password/token/",
      body,
    )
  ).data;
  // there is a return here since we should use unwrap for checking wheter the token is correct
  return response;
});

export const putPassword = createAsyncThunk<PutPasswordResDto, PutPasswordDto>(
  "account/postPassword",
  async ({ newPassword }) => {
    const body: PutPasswordDto = { newPassword };
    const response = (
      await axios.put<PutPasswordResDto>("/api/account/password/", body)
    ).data;
    // there is a return here since we should use unwrap for checking wheter the token is correct
    return response;
  },
);

export const putAccount = createAsyncThunk<void, PutAccountDto>(
  "account/putAccount",
  async ({ lastname, firstname, email }) => {
    const body : PutAccountDto = {lastname, firstname, email};
    await axios.put<PutAccountDto>("/api/account/", body)
  },
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
});

export const accountActions = accountSlice.actions;

export default accountSlice.reducer;
