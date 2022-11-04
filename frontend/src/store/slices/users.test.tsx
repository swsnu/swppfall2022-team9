import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import reducer, { UserState } from "./users";
import { ThunkMiddleware } from "redux-thunk";
import { postSignUp, postSignIn, putSignOut } from "./users";
import axios from "axios";
import { usersStub } from "server/stubs/users.stub";

describe("users reducer", () => {
  let store: EnhancedStore<
    { users: UserState },
    AnyAction,
    [ThunkMiddleware<{ users: UserState }, AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({ reducer: { users: reducer } });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should handle initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      currentUser: null,
    });
  });
  it("tests postSignin", async () => {
    axios.get = jest.fn().mockResolvedValue({ data: usersStub[0] });
    await store.dispatch(
      postSignIn({
        username: usersStub[0].username,
        password: usersStub[0].password,
      }),
    );
  });

  it("tests putSignOut", async () => {
    axios.put = jest.fn().mockResolvedValue({ data: null });
    await store.dispatch(putSignOut());
    expect(store.getState().users.currentUser).toEqual(null);
  });

  it("tests postSignUp", async () => {
    axios.post = jest.fn().mockResolvedValue({ data: usersStub[0] });
    await store.dispatch(
      postSignUp({
        email: usersStub[0].email,
        password: usersStub[0].password,
        username: usersStub[0].username,
        firstname: usersStub[0].firstname,
        lastname: usersStub[0].lastname,
      }),
    );
  });
});
