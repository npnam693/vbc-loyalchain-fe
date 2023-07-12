import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
    TYPE: 
        - Create Order: CREATE
        - Accept Order: ACCEPT
        - Transfer Token: TRANSFER

    STATUS:
        - 0: Pending
        - 1?: Approve Token
        - 2: Send Token
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
}

export interface ITransferTask {
    id: number;
    type: string;
    status: number;
    token: any;
    amount: number;

    orderID?: string;
    transactionHash?: string;
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
            state.taskList.push(action.payload);
            return state;
        },
        
        deleteTask: (state, action: PayloadAction<number>) => {
            state.taskList.splice(action.payload, 1);
            return state;
        },

        updateTask: (state, action: PayloadAction<IActionTask>) => {
            const { id, task } = action.payload;
            state.taskList[id] = task;
            return state;
        },

        openTaskModel: (state, action: PayloadAction<number>) => {

        },
        
        closeTaskModel: (state, action: PayloadAction<undefined>) => {

        }
    }
})

export const { createTask, updateTask } = taskSlice.actions;

export default taskSlice.reducer;