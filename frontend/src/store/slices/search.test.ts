import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import axios from "axios";
import { usersStub } from "server/stubs/users.stub";
import searchReducer, { searchActions, SearchState, getFilteredFriendList } from "./search";

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
      reducer: { search: searchReducer },
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

  it("tests toggle search mode", async () => {
    store.dispatch(searchActions.toggleSearchMode());
    expect(store.getState().search.filteredFriendList).toEqual([]);
    expect(store.getState().search.isSearchMode).toEqual(true);
    expect(store.getState().search.searchWord).toEqual("");
  });

  it("tests toggle search mode twice", async () => {
    store.dispatch(searchActions.toggleSearchMode());
    store.dispatch(searchActions.toggleSearchMode());
    expect(store.getState().search.filteredFriendList).toEqual([]);
    expect(store.getState().search.isSearchMode).toEqual(true);
    expect(store.getState().search.searchWord).toEqual("");
  });

  it("tests SearchModeOff", async () => {
    store.dispatch(searchActions.SearchModeOff());
    expect(store.getState().search.filteredFriendList).toEqual([]);
    expect(store.getState().search.isSearchMode).toEqual(false);
    expect(store.getState().search.searchWord).toEqual("");
  });

  it("tests SearchModeOff", async () => {
    store.dispatch(searchActions.SearchModeOn());
    expect(store.getState().search.filteredFriendList).toEqual([]);
    expect(store.getState().search.isSearchMode).toEqual(true);
    expect(store.getState().search.searchWord).toEqual("");
  });

  it("tests setSearchWord", async () => {
    store.dispatch(searchActions.setSearchWord("hi"));
    expect(store.getState().search.filteredFriendList).toEqual([]);
    expect(store.getState().search.isSearchMode).toEqual(true);
    expect(store.getState().search.searchWord).toEqual("hi");
  });

  it("tests getFilteredFriendList", async () => {
    axios.get = jest.fn().mockResolvedValue({ data: {friendList: usersStub} })
    await store.dispatch(
      getFilteredFriendList("hi")
    )
    expect(store.getState().search.filteredFriendList).toEqual(usersStub);
    expect(store.getState().search.isSearchMode).toEqual(true);
    expect(store.getState().search.searchWord).toEqual("hi");
  });
});
