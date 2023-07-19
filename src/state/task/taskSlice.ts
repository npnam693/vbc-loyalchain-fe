import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
    TYPE: 
        1. One Chain:
            - Create Order: CREATE
            - Accept Order: ACCEPT
            - Transfer Token: TRANSFER
        2. Two Chain:
            + BUYER-DEPOSIT
            + SELLER-DEPOSIT
            + BUYER-WITHDRAW
            + SELLER-WITHDRAW

    TASK STATUS:
        - -2: Fail Send
        - -1: Fail Approve
        - 0: Pending
        - 1?: Approve Token  // Check Balance  
        - 2: Send Token      // Save Order 
        - 3: Done
    ORDER STATUS:
        ['pending', 'receiver accepted', 'sender accepted', 'receiver withdrawn', 'completed', 'canceled'],
*/ 
export interface ITask {
    id: number;
    type: string;
    status: number;
    funcExecute: (taskState : ITaskState, idTask: number) => void;
    from: {
        address: string;
        token: any;
        amount: number;
    };
    to: {
        address: string
        token: any;
        amount: number;
    }
    transactionHash?: string;
    orderID?: string;
    twoChain?: {
        orderStatus ? : string;
    }
}   


export interface ITaskState {
    taskList: ITask[];
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
    task: ITask;
}

const taskSlice = createSlice({
    name: "taskState",
    initialState: initialTaskState,
    reducers: {
        createTask: (state, action: PayloadAction<ITask>) => {
            state.taskList.push(action.payload)
            state.tasksInProgress += 1;
            state.openModalTask = action.payload.id;
            return state;
        },
        deleteTask: (state, action: PayloadAction<number>) => {
            state.taskList.splice(action.payload, 1);
            state.tasksInProgress -= 1;
            return state;
        },
        updateTask: (state, action: PayloadAction<IActionTask>) => {
            const { id, task } = action.payload;
            state.taskList[id] = task;
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

export const { createTask, updateTask, openTaskModel, closeTaskModel, doneOneTask, deleteTask} = taskSlice.actions;

export default taskSlice.reducer;