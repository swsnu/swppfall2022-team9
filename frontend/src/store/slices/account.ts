import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  PutPasswordDto,
  PostPasswordUnauthenticatedDto,
  PutAccountDto,
  AccountInfo,
} from "server/dto/account/account.dto";
import {
  GetAccountResDto,
  PutPasswordResDto,
} from "server/dto/account/account.res.dto";

export interface AccountState {
  currentAccountInfo: AccountInfo | null;
}
const initialState: AccountState = {
  currentAccountInfo: null,
};

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

export const getAccount = createAsyncThunk<GetAccountResDto, void>(
  "account/putAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<GetAccountResDto>("/api/account/");
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      return rejectWithValue(axiosError.response);
    }
  },
);

export const putAccount = createAsyncThunk<void, PutAccountDto>(
  "account/putAccount",
  async ({ lastname, firstname, email }, { rejectWithValue }) => {
    const body: PutAccountDto = { lastname, firstname, email };
    try {
      await axios.put<PutAccountDto>("/api/account/", body);
    } catch (err) {
      const axiosError = err as AxiosError;
      return rejectWithValue(axiosError.response);
    }
  },
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAccount.fulfilled, (state, action) => {
      state.currentAccountInfo = action.payload;
    });
  },
});

export const accountActions = accountSlice.actions;

export default accountSlice.reducer;
