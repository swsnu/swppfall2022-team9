/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { GetFilteredFriendListResDto } from "server/dto/search/search.res.dto";
import { OneChonInfo } from "types/friend.types";

export type SearchState = {
  isSearchMode: boolean;
  searchWord: string;
  filteredFriendList: OneChonInfo[];
};

const initialState: SearchState = {
  isSearchMode: false,
  searchWord: "",
  filteredFriendList: [],
};

export const getFilteredFriendList = createAsyncThunk<
  GetFilteredFriendListResDto,
  string
>("search/getFilteredFriendList", async searchWord => {
  const response = await axios.get(`/api/searchFriends/${searchWord}/`);
  return response.data;
});

export const searchSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchWord: (state, action: PayloadAction<string>) => {
      state.searchWord = action.payload;
    },
    toggleSearchMode: state => {
      state.isSearchMode = !state.isSearchMode;
      state.searchWord = "";
      state.filteredFriendList = [];
    },
    SearchModeOff: state => {
      state.isSearchMode = false;
      state.searchWord = "";
      state.filteredFriendList = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(getFilteredFriendList.fulfilled, (state, action) => {
      state.filteredFriendList = action.payload.friendList;
    });
  },
});

// Action creators are generated for each case reducer function
export const searchActions = searchSlice.actions;

export default searchSlice.reducer;
