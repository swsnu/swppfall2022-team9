import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import axios from "axios";
import { chatRoomInfoListStub } from "server/stubs/chat.stub";
import chatReducer, {
  ChatState,
  getChatRoomInfoList,
  getCurrentChatRoomInfo,
} from "./chat";

describe("chat reducer", () => {
  let store: EnhancedStore<
    { chat: ChatState },
    AnyAction,
    [ThunkMiddleware<{ chat: ChatState }, AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({
      reducer: { chat: chatReducer },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("tests initial state", () => {
    expect(chatReducer(undefined, { type: "unknown" })).toEqual({
      chatRoomInfoList: [],
      currentChatRoomInfo: null,
    });
  });

  it("tests GET ChatRoomInfoList", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        chatRoomInfoList: chatRoomInfoListStub,
      },
    });
    await store.dispatch(getChatRoomInfoList());
  });

  it("tests GET CurrentChatRoomInfo", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        chatRoomName: "1__2",
        otherUserId: 2,
        otherUserName: "박신혜",
        otherUserImgUrl:
          "https://res.cloudinary.com/duyixodey/image/upload/v1669881484/shinhye_park_qqrin4.jpg",
        lastMessage: "hello",
        lastTimeStamp: "2022-12-03T15:57:37.039Z",
      },
    });
    await store.dispatch(getCurrentChatRoomInfo({ chatRoomName: "1__2" }));
  });
});
