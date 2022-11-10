import {
  AnyAction,
  configureStore,
  EnhancedStore,
  MiddlewareArray,
} from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import reducer, {
  getMyProfile,
  getFriendProfile,
  editMyProfile,
  editFriendProfile,
  ProfileState,
} from "./profile";
import { profileStub } from "server/stubs/profiles.stub";
import { postCreateProfile } from "./profile";
import axios from "axios";

const mockDispatch = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useDispatch: () => mockDispatch,
}));

describe("profile reducer", () => {
  let store: EnhancedStore<
    { profile: ProfileState },
    AnyAction,
    MiddlewareArray<
      [ThunkMiddleware<{ profile: ProfileState }, AnyAction, undefined>]
    >
  >;
  beforeAll(() => {
    store = configureStore({
      reducer: { profile: reducer },
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("tests postCreateProfile", async () => {
    axios.post = jest.fn().mockResolvedValue(null);
    await store.dispatch(postCreateProfile(profileStub));
    expect(store.getState().profile.currentProfile).toEqual(null);
  });

  it("tests getMyProfile", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: profileStub });
    await store.dispatch(getMyProfile());
    expect(store.getState().profile.currentProfile).toEqual(profileStub);
  });

  it("tests getMyProfile", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: profileStub });
    await store.dispatch(getFriendProfile(1));
    expect(store.getState().profile.currentProfile).toEqual(profileStub);
  });

  it("tests editMyProfile", async () => {
    jest.spyOn(axios, "put").mockResolvedValue({ data: profileStub });
    await store.dispatch(editMyProfile({ body: profileStub }));
    expect(store.getState().profile.currentProfile).toEqual(profileStub);
  });

  it("tests editMFriendrofile", async () => {
    jest.spyOn(axios, "put").mockResolvedValue({ data: profileStub });
    await store.dispatch(editFriendProfile({ id: 1, body: profileStub }));
    expect(store.getState().profile.currentProfile).toEqual(profileStub);
  });
});
