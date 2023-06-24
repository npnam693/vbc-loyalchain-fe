import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PopupState {
  status: boolean;
  content: string;
  type: string;
}

const initialState: PopupState = {
  status: false,
  content: "",
  type: ""
};

const popupSlice = createSlice({
  name: "popupState",
  initialState: initialState,
  reducers: {
    togglePopup: (state, action: PayloadAction<PopupState>) => {
      state = action.payload;
      return state;
    },
    clearPopup: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { togglePopup, clearPopup } = popupSlice.actions;

export default popupSlice.reducer;
