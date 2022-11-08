import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import reducer, { getChonList, UserState, verifyRegisterToken } from "./users";
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

  it("tests verify register token", async () => {
    axios.get = jest.fn().mockResolvedValue({});
    await store.dispatch(verifyRegisterToken("token"));
  });

  it("tests get chon list", async () => {
    axios.get = jest.fn().mockResolvedValue([
      {
        id: 1,
        firstname: "신혜",
        lastname: "박",
        imgUrl:
          "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
        chons: [
          {
            id: 2,
            firstname: "지",
            lastname: "예",
            imgUrl:
              "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/01/03/XlaLfTVZ5iIM637768407379571191.jpg",
          },
          {
            id: 3,
            firstname: "민아",
            lastname: "신",
            imgUrl:
              "https://search.pstatic.net/common?type=b&size=216&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202110%2F20211028162722613.jpg",
          },
        ],
      },
    ]);
    await store.dispatch(getChonList());
    expect(store.getState().users.chonList.length).toEqual(1);
  });
});
