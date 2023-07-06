import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IToken {
    name: string,
    symbol: string,
    deployedAddress: string,
    network: number,
    image: string,
}

interface IApp {
    web3: any;
    isConnectedWallet: boolean,
    tokens: IToken[],
}

const initialAppState : IApp= {
    web3: null,
    isConnectedWallet: false,
    tokens: []
}

export const appSlice = createSlice({
    name: "appState",
    initialState: initialAppState,
    reducers: {
      saveWeb3: (state, action: PayloadAction<any>) => {
        return {...state, isConnectedWallet: true, web3: action.payload}
      },
      clearWeb3: (state, action: PayloadAction<undefined>) => {
        return {...state, isConnectedWallet: false, web3: null};
      },
      saveTokens: (state, action: PayloadAction<IToken[]>) => {
        return {...state, tokens: action.payload}
      },
      clearTokens: (state, action: PayloadAction<undefined>) => {
        return {...state, tokens: []};
      }
    },
});
  
export const { saveWeb3, clearWeb3, saveTokens, clearTokens } = appSlice.actions;
  
export default appSlice.reducer;

  
