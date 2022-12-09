import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import { getAllSkillTags } from "./skillTags";

const mockDispatch = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useDispatch: () => mockDispatch,
}));

describe("skilltags reducer", () => {
    let store: EnhancedStore<
    unknown,
    AnyAction,
    [ThunkMiddleware<unknown,AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({ reducer: {} });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("tests getAllQualityTags", async () => {
    axios.get = jest.fn().mockResolvedValue({})
    await store.dispatch(getAllSkillTags())
  });
});
