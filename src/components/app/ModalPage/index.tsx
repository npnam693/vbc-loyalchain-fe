import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import './ModalPage.scss'
import { closeTaskModel, deleteTask } from '../../../state/task/taskSlice'
import ModalTransfer from './helper/Transfer'
import ModalCreate from './helper/Create'
import SellerCreateModal from './helper/SellerCreate'
import ModalRemove from './helper/Remove'
import ModalAccept from './helper/Accept'
import ModalWithdraw from './helper/Withdraw'
import ModalBuyerAccept from './helper/BuyerAccept'

const ModalPage = () => {
    const taskState = useAppSelector(state => state.taskState)
    const dispatch = useAppDispatch()
    if (taskState.openModalTask === -1) return <></>
    const task = taskState.taskList[taskState.openModalTask]

    const afterClose = () => {
        dispatch(closeTaskModel())
        if (task.status === 0) {
            dispatch(deleteTask(task.id))
        }
    }
    if (task.type === "TRANSFER"){
        return (
            <ModalTransfer task={task} taskState={taskState} afterClose={afterClose}/>
        )
    }
    else if (task.type === "CREATE"){
        return (
            <ModalCreate task={task} taskState={taskState} afterClose={afterClose}/>
        )
    }   
    else if (task.type === "SELLER-CREATE") {
        return (
            <SellerCreateModal task={task} taskState={taskState} afterClose={afterClose}/>
        )
    }   
    else if (task.type === "REMOVE" || task.type === "SELLER-REMOVE") {
        return (
            <ModalRemove task={task} taskState={taskState} afterClose={afterClose}/>
        )
    } 
    else if (task.type === "ACCEPT" || task.type === "SELLER-DEPOSIT")  {
        return (
            <ModalAccept task={task} taskState={taskState} afterClose={afterClose}/>
        )
    }
    else if (task.type === "BUYER-DEPOSIT") {
        return (
            <ModalBuyerAccept task={task} taskState={taskState} afterClose={afterClose}/>
        )
    }
    else if (task.type === "BUYER-WITHDRAW" || task.type === "SELLER-WITHDRAW") {
        return (
            <ModalWithdraw task={task} taskState={taskState} afterClose={afterClose}/>
        )
    }
    else return <></>

}

export default ModalPage