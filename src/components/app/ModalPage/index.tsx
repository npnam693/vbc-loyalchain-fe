import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import './ModalPage.scss'
import { closeTaskModel, deleteTask } from '../../../state/task/taskSlice'
import ModalTransfer from './helper/Transfer'
import ModalCreate from './helper/Create'
import SellerCreateModal from './helper/SellerCreate'
import ModalRemove from './helper/Remove'
import ModalAccept from './helper/Accept'
import ModalSellerWithdraw from './helper/SellerWithdraw'
import ModalBuyerWithdraw from './helper/BuyerWithdraw'
import ModalBuyerDeposit from './helper/BuyerDeposit'
import ModalSellerDeposit from './helper/SellerDeposit'
import ModalRefund from './helper/Refund'



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
    switch (task.type) {
        case "TRANSFER":
            return <ModalTransfer task={task} taskState={taskState} afterClose={afterClose}/>
        case "CREATE":
            return <ModalCreate task={task} taskState={taskState} afterClose={afterClose}/>
        case "ACCEPT":
            return <ModalAccept task={task} taskState={taskState} afterClose={afterClose}/>
        case "REMOVE":
            return <ModalRemove task={task} taskState={taskState} afterClose={afterClose}/>
    
        case "SELLER-CREATE":
            return <SellerCreateModal task={task} taskState={taskState} afterClose={afterClose}/>
        case "BUYER-DEPOSIT":
            return <ModalBuyerDeposit task={task} taskState={taskState} afterClose={afterClose}/>
        case "SELLER-DEPOSIT":
            return <ModalSellerDeposit task={task} taskState={taskState} afterClose={afterClose}/>
        case "SELLER-WITHDRAW":
            return <ModalSellerWithdraw task={task} taskState={taskState} afterClose={afterClose}/>
        case "BUYER-WITHDRAW":
            return <ModalBuyerWithdraw task={task} taskState={taskState} afterClose={afterClose}/>
        case "SELLER-REMOVE":
            return <ModalRemove task={task} taskState={taskState} afterClose={afterClose}/>
        case "REFUND":
            return <ModalRefund task={task} taskState={taskState} afterClose={afterClose}/>
        default:
            return <></>
    }

}

export default ModalPage