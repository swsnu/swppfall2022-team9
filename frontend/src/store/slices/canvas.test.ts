import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import canvasReducer, { canvasActions, CanvasState } from "./canvas";

describe("canvas reducer", () => {
  let store: EnhancedStore<
    { canvas: CanvasState },
    AnyAction,
    [ThunkMiddleware<{ canvas: CanvasState }, AnyAction, undefined>]
  >;
  beforeAll(() => {
    store = configureStore({
      reducer: { canvas: canvasReducer },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("tests initial state", () => {
    expect(canvasReducer(undefined, { type: "unknown" })).toEqual({
      oneChonIdToExpandNetwork: null,
    });
  });

  it("tests setOneChonIdToExpandNetwork", async () => {
    store.dispatch(canvasActions.setOneChonIdToExpandNetwork(2));
    expect(store.getState().canvas.oneChonIdToExpandNetwork).toEqual(2);
  });
});
