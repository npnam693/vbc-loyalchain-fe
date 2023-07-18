import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
    TYPE: 
        - Create Order: CREATE
        - Accept Order: ACCEPT
        - Transfer Token: TRANSFER
        
        + Create Order: TWOCHAIN-CREATE
        + Accept Order: TWOCHAIN-DEPOSIT
        + Transfer Token: TWOCHAIN-WITHDRAW

    STATUS:
        - -2: Fail Send
        - -1: Fail Approve
        - 0: Pending
        - 1?: Approve Token  // Check Balance
        - 2: Send Token      // Save Order 
        - 3: Done
*/
export interface ICreateTask {
    id: number;
    type: string;

    status: number;

    tokenFrom: any;
    tokenTo: any;
    amountFrom: number;
    amountTo: number;

    transactionHash?: string;
    orderID?: string;

    token?: any;
    amount?: number;
    recipient?: string;
    owner?: string;

}   
 
export interface IAcceptTask {
    id: number;
    type: string;

    status: number;

    tokenFrom: any;
    tokenTo: any;
    amountFrom: number;
    amountTo: number;

    owner: string;
    orderID: string;
    transactionHash?: string;

    token?: any;
    amount?: number;
    recipient?: string;
}

export interface ITransferTask {
    id: number;
    type: string;
    status: number;
    token: any;
    amount: number;

    orderID?: string;
    transactionHash?: string;

    tokenFrom?: any;
    tokenTo?: any;
    amountFrom?: number;
    amountTo?: number;

    recipient?: string;
    owner?: string;

}


export interface ITaskState {
    taskList: (ICreateTask | IAcceptTask | ITransferTask)[];
    tasksInProgress: number;
    openModalTask: number;

}


export const initialTaskState : ITaskState = {
    taskList: [],
    tasksInProgress: 0,
    openModalTask: -1
}

interface IActionTask {
    id: number;
    task: ICreateTask | IAcceptTask | ITransferTask;
}

const taskSlice = createSlice({
    name: "taskState",
    initialState: initialTaskState,
    reducers: {
        createTask: (state, action: PayloadAction<ICreateTask | IAcceptTask | ITransferTask>) => {
            state.taskList = [action.payload, ...state.taskList]
            state.tasksInProgress += 1;
            return state;
        },
        
        deleteTask: (state, action: PayloadAction<number>) => {
            state.taskList.splice(action.payload, 1);
            return state;
        },

        updateTask: (state, action: PayloadAction<IActionTask>) => {
            const { id, task } = action.payload;
            state.taskList[state.taskList.length - id -1] = task;
            return state;
        },
        doneOneTask: (state, action: PayloadAction<undefined>) => {
            state.tasksInProgress -= 1;
            return state;
        },
        openTaskModel: (state, action: PayloadAction<number>) => {
            state.openModalTask = action.payload;
        },
        
        closeTaskModel: (state, action: PayloadAction<undefined>) => {
            state.openModalTask = -1;
        }
    }
})

export const { createTask, updateTask, openTaskModel, closeTaskModel, doneOneTask } = taskSlice.actions;

export default taskSlice.reducer;