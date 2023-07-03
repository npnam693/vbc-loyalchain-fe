import {createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IToken {
    name: string,
    symbol: string,
    deployedAddress: string,
    network: number,
    image: string,
}

export const initialTokenState : IToken[] = [] 

const tokenSlice = createSlice({
    name: "userState",
    initialState: initialTokenState,
    reducers: {
      updateTokens: (state, action: PayloadAction<IToken[]>) => {
        state = action.payload;
        return state
      },
      clearTokens: (state, action: PayloadAction<undefined>) => {
        state = initialTokenState;
        return state;
      },
    },
});

export const {updateTokens, clearTokens} = tokenSlice.actions;

export default tokenSlice.reducer;