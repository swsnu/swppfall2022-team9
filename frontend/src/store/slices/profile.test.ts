import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import reducer, { ProfileState } from "./profile";
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
    [ThunkMiddleware<{ profile: ProfileState }, AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({ reducer: { profile: reducer } });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {});
  it("tests postCreateProfile", async () => {
    axios.post = jest.fn().mockResolvedValue(null);
    await store.dispatch(postCreateProfile(profileStub));
  });
});
