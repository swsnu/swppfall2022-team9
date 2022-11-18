import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import userSlice from "./users";
import { RootState } from "..";
import friendRequestSlice from "./friendRequests";
import profileSlice from "./profile";
import searchSlice from "./search";

const rootReducer = combineReducers({
  users: userSlice,
  friendRequests: friendRequestSlice,
  profile: profileSlice,
  search: searchSlice,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export default rootReducer;
