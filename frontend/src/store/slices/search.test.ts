import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import reducer, {
  searchActions,
  filterFriendList,
  SearchState,
} from "./search";
import { friendListStub2 } from "server/stubs/users.stub";

const mockDispatch = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useDispatch: () => mockDispatch,
}));

describe("profile reducer", () => {
  let store: EnhancedStore<
    { search: SearchState },
    AnyAction,
    [ThunkMiddleware<{ search: SearchState }, AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({
      reducer: { search: reducer },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("tests initial state", async () => {
    expect(store.getState().search.filteredFriendList).toEqual([]);
    expect(store.getState().search.isSearchMode).toEqual(false);
    expect(store.getState().search.searchWord).toEqual("");
  });

  it("tests valid search", async () => {
    filterFriendList(friendListStub2, "신혜");
  });

  it("tests twochon search", async () => {
    filterFriendList(friendListStub2, "민아");
  });

  it("tests toggle search mode", async () => {
    store.dispatch(searchActions.toggleSearchMode());
    expect(store.getState().search.filteredFriendList).toEqual([]);
    expect(store.getState().search.isSearchMode).toEqual(true);
    expect(store.getState().search.searchWord).toEqual("");
  });
});
