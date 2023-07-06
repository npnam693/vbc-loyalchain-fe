import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const initialLoadingState : boolean = false

const loadingSlice = createSlice({
    name: "loadingState",
    initialState: initialLoadingState,
    reducers: {
      runLoading: (state, action: PayloadAction<undefined>) => {
        return true;
      },
      stopLoading: (state, action: PayloadAction<undefined>) => {
        state = initialLoadingState;
        return state;
      },
    },
});

export const { runLoading, stopLoading } = loadingSlice.actions;


export default loadingSlice.reducer;
