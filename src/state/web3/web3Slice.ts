import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IWeb3 {
    web3: any;
    isConnected: boolean
}
const initialWeb3State : IWeb3= {
    web3: null,
    isConnected: false,
}


export const web3Slice = createSlice({
    name: "Web3State",
    initialState: initialWeb3State,
    reducers: {
      saveWeb3: (state, action: PayloadAction<IWeb3>) => {
        state = action.payload;
        return state
      },
      clearWeb3: (state, action: PayloadAction<undefined>) => {
        state = initialWeb3State;
        return state;
      },
    },
  });
  

  export const { saveWeb3, clearWeb3 } = web3Slice.actions;
  
  
  export default web3Slice.reducer;

  


