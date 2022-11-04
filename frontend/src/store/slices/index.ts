import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import userSlice from "./users";
import { RootState } from "..";
import friendRequestSlice from "./friendRequests";

const rootReducer = combineReducers({
  users: userSlice,
  friendRequests: friendRequestSlice,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export default rootReducer;
