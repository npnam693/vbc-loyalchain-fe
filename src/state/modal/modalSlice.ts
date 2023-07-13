import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultStatusType } from "antd/es/result";

export interface IModalState {
    open: boolean;
    titleModal: string;

    status: ResultStatusType;
    title: string;
    subtitle: string;
    content: any;
}

export const initialModalState : IModalState = {
    open: false,
    titleModal: "",
    status: "success",
    title: "",
    subtitle: "",
    content: null
}


const modalSlice = createSlice({
    name: "userState",
    initialState: initialModalState,
    reducers: {
        saveModal: (state, action: PayloadAction<IModalState>) => {
            state = action.payload;
            return state
        },
        clearModal: (state, action: PayloadAction<undefined>) => {
            state = initialModalState;
            return state;
        },
    },
});
  
export const { saveModal, clearModal } = modalSlice.actions;

export default modalSlice.reducer;
