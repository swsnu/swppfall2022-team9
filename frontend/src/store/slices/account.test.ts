import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import accountReducer, {
  AccountState,
  getAccount,
  postPasswordUnauthenticated,
  putAccount,
  putPassword,
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle initial state", () => {
    expect(accountReducer(undefined, { type: "unknown" })).toEqual({
      currentAccountInfo: null,
    });
  });

  it("tests post password unauthenticated", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {},
    });
    await store.dispatch(
      postPasswordUnauthenticated({ token: "test", newPassword: "test" }),
    );
  });

  it("tests authenticated post password", async () => {
    axios.post = jest.fn().mockResolvedValue({});
    await store.dispatch(putPassword({ newPassword: "test" }));
  });

  it("tests put password", async () => {
    axios.put = jest.fn().mockResolvedValue({});
    await store.dispatch(putPassword({ newPassword: "test" }));
  });

  it("tests get account", async () => {
    axios.get = jest.fn().mockResolvedValue({});
    await store.dispatch(getAccount());
  });

  it("tests get account error", async () => {
    axios.get = jest.fn().mockRejectedValue({});
    await store.dispatch(getAccount());
  });

  it("tests put account", async () => {
    axios.put = jest.fn().mockResolvedValue({});
    await store.dispatch(
      putAccount({ lastname: "hi", firstname: "hi", email: "hi" }),
    );
  });

  it("tests put account error", async () => {
    axios.put = jest.fn().mockRejectedValue({});
    await store.dispatch(
      putAccount({ lastname: "hi", firstname: "hi", email: "hi" }),
    );
  });
});
