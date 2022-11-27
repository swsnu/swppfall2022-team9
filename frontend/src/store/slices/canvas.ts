import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CanvasState = {
  oneChonIdToExpandNetwork: number | null;
};

const initialState: CanvasState = {
  oneChonIdToExpandNetwork: null,
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setOneChonIdToExpandNetwork: (
      state,
      action: PayloadAction<number | null>,
    ) => {
      state.oneChonIdToExpandNetwork = action.payload;
    },
  },
});

export const canvasActions = canvasSlice.actions;
export default canvasSlice.reducer;
