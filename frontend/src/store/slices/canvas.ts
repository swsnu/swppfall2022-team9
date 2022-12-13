import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CanvasState = {
  oneChonIdToExpandNetwork: number | null;
  isPanZoomed: boolean;
};

const initialState: CanvasState = {
  oneChonIdToExpandNetwork: null,
  isPanZoomed: false,
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
    setIsPanZoomed: (state, action: PayloadAction<boolean>) => {
      state.isPanZoomed = action.payload;
    },
  },
});

export const canvasActions = canvasSlice.actions;
export default canvasSlice.reducer;
