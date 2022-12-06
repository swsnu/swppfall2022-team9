import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import searchReducer, { searchActions, SearchState } from "./search";

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

  it("tests SearchModeOff", async () => {
    store.dispatch(searchActions.SearchModeOff());
    expect(store.getState().search.filteredFriendList).toEqual([]);
    expect(store.getState().search.isSearchMode).toEqual(false);
    expect(store.getState().search.searchWord).toEqual("");
  });
});
