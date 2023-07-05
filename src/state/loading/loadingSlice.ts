import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILoading {
    isLoading: boolean;
}

export const initialLoadingState : ILoading = {
    isLoading: false
}

const loadingSlice = createSlice({
    name: "loadingState",
    initialState: initialLoadingState,
    reducers: {
      runLoading: (state, action: PayloadAction<ILoading>) => {
        state = action.payload;
        return state
      },
      stopLoading: (state, action: PayloadAction<undefined>) => {
        state = initialLoadingState;
        return state;
      },
    },
});

export const { runLoading, stopLoading } = loadingSlice.actions;


export default loadingSlice.reducer;
