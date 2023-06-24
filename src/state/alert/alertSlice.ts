import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum AlertType {
  LOADING,
  CONFIRM,
}

export interface AlertState {
  status: boolean;
  timeOut?: number;
  title?: string;
}

const initialState: AlertState = {
  status: false,
  title: "",
};

const alertSlice = createSlice({
  name: "alert",
  initialState: initialState,
  reducers: {
    toggle: (state, action: PayloadAction<AlertState>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { toggle } = alertSlice.actions;

export default alertSlice.reducer;
