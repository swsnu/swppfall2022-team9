/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OneChonInfo } from "types/friend.types";

export type SearchState = {
  isSearchMode: boolean;
  searchWord: string;
  filteredFriendList: OneChonInfo[];
};

export type SearchPayload = {
  searchWord: string;
  friendList: OneChonInfo[];
};

const initialState: SearchState = {
  isSearchMode: false,
  searchWord: "",
  filteredFriendList: [],
};

export const filterFriendList = (
  friendList: OneChonInfo[],
  searchWord: string,
): OneChonInfo[] => {
  return friendList.map(oneChon => {
    const filteredTwoChons = oneChon.chons.map(twoChon => {
      return (twoChon.lastname + twoChon.firstname).includes(searchWord)
        ? { ...twoChon }
        : { ...twoChon, isNotFiltered: true };
    });
    return (oneChon.lastname + oneChon.firstname).includes(searchWord)
      ? { ...oneChon, chons: filteredTwoChons }
      : { ...oneChon, chons: filteredTwoChons, isNotFiltered: true };
  });
};

export const searchSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
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
    search: (state, actions: PayloadAction<SearchPayload>) => {
      state.searchWord = actions.payload.searchWord;
      state.filteredFriendList = filterFriendList(
        actions.payload.friendList,
        actions.payload.searchWord,
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const searchActions = searchSlice.actions;

export default searchSlice.reducer;
