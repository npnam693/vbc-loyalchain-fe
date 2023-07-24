import { useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Divider, Input, InputNumber} from 'antd'
import { CloseCircleOutlined} from '@ant-design/icons'

import './SendToken.scss'
import appApi from '../../../api/appAPI'
import { saveInfo } from '../../../state/user/userSlice'
import { getTokenContract } from '../../../services/contract'
import { showConfirmConnectWallet } from '../../../pages/marketplace'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import { getBalanceAccount, mappingNetwork } from '../../../utils/blockchain'
import { ITask, ITaskState, createTask, doneOneTask, updateTask } from '../../../state/task/taskSlice'
import { fixStringBalance } from '../../../utils/string'
interface ISendToken {
    token?: any;
    onCloseBtn: () => void
}
 
const SendToken = (props : ISendToken) => {
    const dispatch = useAppDispatch()
    const {userState, appState, taskState} = useAppSelector(state => state)
    const [formData, setFormData] = useState({
        token: {},
        amount: 0,
        to: "",
    })
    const hdClickSend = () => {
        if (!appState.isConnectedWallet) {
            showConfirmConnectWallet(dispatch, appState, userState)
            return
        }
        let transferTask : ITask = {
            id: taskState.taskList.length,
            type: "TRANSFER",
            status: 0,
            funcExecute: sendToken,
            from: {address: userState.address, token: props.token.token, amount: formData.amount},
            to: {address: formData.to, token: props.token.token, amount: formData.amount}
        }
        dispatch(createTask(transferTask))
    }
    const sendToken = async (taskState: ITaskState, idTask: number) => {
        const toaster = toast.loading("Transfering token...")
        let task : ITask = {...taskState.taskList[idTask], status: 2}
        dispatch(updateTask({task, id: idTask}))
        try {
            const tokenContract = getTokenContract(appState.web3, props.token.token.deployedAddress)
            const decimal = await tokenContract.methods.decimals().call({from: userState.address});
            const amount: BigInt = BigInt(10 ** Number(decimal) * formData.amount); // Số lượng token bạn muốn chuyển (1 token = 10^18 wei)
            const myReceipt = await tokenContract.methods.transfer(formData.to, amount).send({
                from: userState.address,
                gas: await tokenContract.methods.transfer(formData.to, amount).estimateGas({
                  from: userState.address,
                  data: tokenContract.methods.transfer(formData.to, amount).encodeABI(),
                }),
                gasPrice: "0"
            });
            const transferData = await appApi.createTransfer( {
                fromValue: formData.amount,
                fromTokenId: props.token.token._id,
                to: formData.to,
            })
            dispatch(saveInfo({...userState, 
                wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
                balance:fixStringBalance(String(
                    await appState.web3.eth.getBalance(userState.address)
                ), 18)})
            )
            task = {...task, orderID: transferData && transferData.data._id, transactionHash: myReceipt.transactionHash, status: 3}
            dispatch(updateTask({task, id: idTask}))
            dispatch(doneOneTask())
            toast.update(toaster, { render: "Transfer Token successfully!", type: "success", isLoading: false, autoClose: 1000});
        } catch (error) {
            console.log(error)
            dispatch(updateTask({
                task: {...task, status: -1},
                id: idTask
            }))
            dispatch(doneOneTask())
            toast.update(toaster, { render: "Transfer Token fail!", type: "error", isLoading: false, autoClose: 1000});
        }
    }
    return (
    <div className='app-sendToken'>
        <div className='container'>
            <div className="close" onClick={props.onCloseBtn}>
                <CloseCircleOutlined className="close--icon" rev={"size"} />
            </div>
            <div className='header'>
                <p className='title'>Transfer Token</p>
                <p className='desc'>Send tokens to the destination you want.</p>
            </div>
            <Divider className="divider" />
            <div className='token'>
                <img src={props.token.token.image} alt='token' className='token-img'/>            
                <div>
                    <p className='token-name'>{props.token.token.name}</p>
                    <p className='token-net'>{mappingNetwork(props.token.token.network)}</p>
                </div>
            </div>
            <p className='user-address'>From: <span>{userState.address}</span></p>
            <p className='token-balance'>Your balance: <span>{props.token.balance} {props.token.token.symbol}</span></p>
            <div className='sendto'>
                <p>Send to</p>
                <Input placeholder='Recipient Address'
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                />
            </div>
            <div className='amount'>
                <p>Amount</p>
                <InputNumber 
                    min={0} max={props.token.balance} 
                    className='amount-input'
                    value={formData.amount}
                    onChange={(val) => setFormData({ ...formData, amount: Number(val) })}
                />
                <Button className='amount-btn'
                    onClick={() => setFormData({ ...formData, amount: Number(props.token.balance) })}
                >MAX</Button>
            </div>

            <Button type='primary' className='send-btn' size='large' 
                onClick={() => {hdClickSend()}}
            > Send
            </Button>
        </div>
    </div>
  )
}

export default SendToken