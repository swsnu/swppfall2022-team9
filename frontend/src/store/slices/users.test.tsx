import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import reducer, {
  getFriendList,
  getSessionCookie,
  UserState,
  verifyRegisterToken,
} from "./users";
import { ThunkMiddleware } from "redux-thunk";
import { postSignUp, postSignIn, getSignOut } from "./users";
import axios from "axios";
import { usersStub } from "server/stubs/users.stub";
import { profileStub } from "server/stubs/profiles.stub";

const mockDispatch = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useDispatch: () => mockDispatch,
}));

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

  it("should handle initial state", async () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      currentUser: null,
      friendList: [],
    });
  });

  it("tests postSignin", async () => {
    axios.post = jest.fn().mockResolvedValue({ data: usersStub[0] });
    axios.get = jest.fn().mockResolvedValue({ data: profileStub });
    await store.dispatch(
      postSignIn({
        username: usersStub[0].username,
        password: usersStub[0].password,
      }),
    );
    expect(store.getState().users.currentUser?.username).toEqual(
      usersStub[0].username,
    );
  });

  it("tests getSignOut", async () => {
    axios.get = jest.fn().mockResolvedValue({ data: null });
    await store.dispatch(getSignOut());
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

  it("tests verify register token", async () => {
    axios.get = jest.fn().mockResolvedValue({});
    await store.dispatch(verifyRegisterToken("token"));
  });

  it("tests verify get Session Cookie rejected", async () => {
    axios.get = jest
      .fn()
      .mockRejectedValue({});
    await store.dispatch(getSessionCookie());
  });

  it("tests verify get Session Cookie", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: usersStub[0] })
      .mockResolvedValueOnce({ data: profileStub });
    await store.dispatch(getSessionCookie());
  });

  it("tests get chon list", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: {
        friendList: [
          {
            id: 1,
            firstname: "신혜",
            lastname: "박",
            imgUrl:
              "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
            chons: [],
          },
        ],
      },
    });
    await store.dispatch(getFriendList());
    expect(store.getState().users.friendList.length).toEqual(1);
  });
});
