import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
    TYPE: 
        - Create Order: CREATE
        - Accept Order: ACCEPT
        - Transfer Token: TRANSFER

    STATUS:
        - 1?: Approve
        - 2: Send Token
        - 3: Done
*/
export interface ICreateTask {
    id: number;
    title: string;

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
    title: string;

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
    title: string;
    status: number;
    token: any;
    amount: number;

    orderID: string;
    transactionHash?: string;
}


export interface ITaskState {
    taskList: (ICreateTask | IAcceptTask | ITransferTask)[];
    tasksInProgress: number;
}


export const initialTaskState : ITaskState = {
    taskList: [],
    tasksInProgress: 0,
}

interface IActionTask {
    id: number;
    task: ICreateTask | IAcceptTask | ITransferTask
}

const taskSlice = createSlice({
    name: "taskState",
    initialState: initialTaskState,
    reducers: {
        createTask: (state, action: PayloadAction<ICreateTask | IAcceptTask | ITransferTask>) => {
            state.taskList.push(action.payload);
            return state;
        },
        updateTask: (state, action: PayloadAction<IActionTask>) => {
            const { id, task } = action.payload;
            state.taskList[id] = task;
            return state;
        }
    }
})

export const { createTask, updateTask } = taskSlice.actions;

export default taskSlice.reducer;