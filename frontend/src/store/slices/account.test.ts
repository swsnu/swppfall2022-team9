import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import accountReducer, {
  AccountState,
  postPasswordUnauthenticated,
  postPassword,
} from "./account";
import axios from "axios";

describe("friend request reducer", () => {
  let store: EnhancedStore<
    { account: AccountState },
    AnyAction,
    [ThunkMiddleware<{ account: AccountState }, AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({
      reducer: { account: accountReducer },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle initial state", () => {
    expect(accountReducer(undefined, { type: "unknown" })).toEqual({});
  });

  it("tests post password unauthenticated", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {},
    });
    await store.dispatch(
      postPasswordUnauthenticated({ token: "test", password: "test" }),
    );
  });

  it("tests authenticated post password", async () => {
    axios.post = jest.fn().mockResolvedValue({});
    await store.dispatch(postPassword({ password: "test" }));
  });

  // TODO: create more test for account slice
});
