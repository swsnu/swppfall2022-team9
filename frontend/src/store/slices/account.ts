import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// we do not need anything for account slice
const initialState = undefined;

// TODO: implement POST request for changing password (박재승)
// 1. changing password for authenticated users
// 2. changing password for unauthenticated users (must send verification token in body)

export const postPasswordUnauthenticated = createAsyncThunk(
  "account/postPasswordUnauthenticated",
  async () => {},
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
});
