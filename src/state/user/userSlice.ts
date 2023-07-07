import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IToken } from "../app/appSlice";

export interface IAsset {
  token: IToken;
  balance: string;
}
export interface IUserState {
  address: string;
  token: string;
  network: number;
  wallet: IAsset[];
  balance: string;
  isAuthenticated: boolean;
  signature: string,
}

export const initialUserState : IUserState = {
  address: "",
  token: "",
  network: -1,
  wallet: [],
  balance: "0",
  isAuthenticated: false,
  signature: "",
}

const userSlice = createSlice({
  name: "userState",
  initialState: initialUserState,
  reducers: {
    saveInfo: (state, action: PayloadAction<IUserState>) => {
      state = action.payload;
      return state
    },
    clearInfo: (state, action: PayloadAction<undefined>) => {
      state = initialUserState;
      return state;
    },
  },
});

export const { saveInfo, clearInfo } = userSlice.actions;

export default userSlice.reducer;
