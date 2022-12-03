import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import reducer, {
  editMyProfile,
  ProfileState,
  getFriendProfileWithoutStateUpdate,
  getProfile,
} from "./profile";
import { profileStub } from "server/stubs/profiles.stub";
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
    [ThunkMiddleware<{ profile: ProfileState }, AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({
      reducer: { profile: reducer },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("tests getProfile", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: { ...profileStub } });
    await store.dispatch(getProfile(1));
    expect(store.getState().profile.currentProfile).toEqual(profileStub);
  });

  it("tests getFriendProfileWithoutStateUpdate", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: { ...profileStub } });
    await store.dispatch(getFriendProfileWithoutStateUpdate(1));
  });

  it("tests editMyProfile", async () => {
    const editedProfile = { ...profileStub, introduction: "hello new intro" };
    expect(store.getState().profile.currentProfile).toEqual(profileStub);
    jest.spyOn(axios, "put").mockResolvedValue({ data: editedProfile });
    await store.dispatch(
      editMyProfile({
        ...profileStub,
      }),
    );
  });
});
