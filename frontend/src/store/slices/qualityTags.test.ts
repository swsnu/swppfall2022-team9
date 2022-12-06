import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import reducer, {
  getAllQualityTags,
  getUserQualityTags,
  putUserQualityTags,
  QualityTagsState,
} from "./qualityTags";
import { qualityTagStub } from "server/stubs/qualityTags.stub";
import axios from "axios";

const mockDispatch = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useDispatch: () => mockDispatch,
}));

describe("profile reducer", () => {
  let store: EnhancedStore<
    { quality: QualityTagsState },
    AnyAction,
    [ThunkMiddleware<{ quality: QualityTagsState }, AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({
      reducer: { quality: reducer },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("tests getAllQualityTags", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({ data: { qualityTags: qualityTagStub } });
    await store.dispatch(getAllQualityTags());
    expect(store.getState().quality.qualityTagsList).toEqual(qualityTagStub);
  });

  it("tests getUserQualityTags", async () => {
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: { qualityTags: qualityTagStub } });
    await store.dispatch(getUserQualityTags(1));
    expect(store.getState().quality.currentUserQualityTags).toEqual(
      qualityTagStub,
    );
  });

  it("tests putUserQualityTags", async () => {
    jest
      .spyOn(axios, "put")
      .mockResolvedValue({ data: { qualityTags: qualityTagStub } });
    await store.dispatch(
      putUserQualityTags({ qualityTags: qualityTagStub, id: 1 }),
    );
    expect(store.getState().quality.currentUserQualityTags).toEqual(
      qualityTagStub,
    );
  });
});
