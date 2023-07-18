import { useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Divider, Input, InputNumber, Modal, Steps } from 'antd'
import { CloseCircleOutlined, LoadingOutlined, RightSquareTwoTone } from '@ant-design/icons'

import './SendToken.scss'
import appApi from '../../../api/appAPI'
import { saveInfo } from '../../../state/user/userSlice'
import { getTokenContract } from '../../../services/contract'
import { showConfirmConnectWallet } from '../../../pages/marketplace'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import { getBalanceAccount, mappingNetwork } from '../../../utils/blockchain'
import { ITransferTask, createTask, doneOneTask, updateTask } from '../../../state/task/taskSlice'

interface ISendToken {
    token?: any;
    onCloseBtn: () => void
}

const SendToken = (props : ISendToken) => {
    const dispatch = useAppDispatch()
    const userState = useAppSelector((state) => state.userState);
    const tokenState = useAppSelector((state) => state.appState.tokens); 
    const appState = useAppSelector((state) => state.appState); 
    const taskState = useAppSelector(state => state.taskState)

    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState({
        token: {},
        amount: 0,
        to: "",
    })
    const [idTask, setIdTask] = useState(-1)
    

    const submitSendToken = async () => {
        if (!appState.isConnectedWallet) {
            showConfirmConnectWallet(dispatch, appState, userState)
            return
        }
        const toaster = toast.loading("Transfering token...")
        const transferTask : ITransferTask = {
            id: taskState.taskList.length,
            type: "TRANSFER",
            status: 2,
            token: props.token.token,
            amount: formData.amount,
            recipient: formData.to,
        }

        dispatch(createTask(transferTask))
        setIdTask(transferTask.id)
        
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

            dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, tokenState)}))
            
            dispatch(updateTask({
                task: {
                    ...transferTask, 
                    orderID: transferData && transferData.data._id, 
                    transactionHash: myReceipt.transactionHash,
                    status: 3,
                }, 
                id: transferTask.id
            }))
            dispatch(doneOneTask())
            toast.update(toaster, { render: "Transfer Token successfully!", type: "success", isLoading: false, autoClose: 1000});
        } catch (error) {
            console.log(error)
            dispatch(updateTask({
                task: {
                    ...transferTask, 
                    status: -1,
                }, 
                id: transferTask.id
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
                onClick={() => {setOpenModal(true)}}
            >
                Send
                
            </Button>
            <Modal
                title="Transfer Token"
                open={openModal}
                onOk={idTask === -1 ? submitSendToken : () => {setOpenModal(false);  setIdTask(-1)}}
                okText= {idTask === -1 ? "Confirm" : 'OK'}
                cancelText="Cancel"
                onCancel={() => {setOpenModal(false); setIdTask(-1)}}
                width={700}
                style={{top: 200}}
                closable={true}
            >
                <Steps
                    size="default"
                    style={{width: 400, margin: 'auto', marginTop: 40, marginBottom: 30}}
                    items={[
                        idTask !== -1 ? {
                            title: 'Send Token',
                            status: taskState.taskList[taskState.taskList.length - 1 - idTask].status === -1 ? 'error' : 
                                    (taskState.taskList[taskState.taskList.length - 1 - idTask].status === 3 ? 'finish' : 'process'),
                            icon: taskState.taskList[taskState.taskList.length - 1 - idTask].status === 2 && <LoadingOutlined  rev={""}/>,
                        }
                        :
                        {
                            title: 'Send Token',
                            status: 'wait'
                        }
                        ,
                        idTask === -1 ? {
                            title: 'Done',
                            status: 'wait',
                        }
                        :
                        {
                            title: 'Done',
                            status: taskState.taskList[taskState.taskList.length - 1 - idTask].status === 3 ? 'finish' : 'wait'
                        }
                        ,
                    ]}
                />
                
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 16}}>
                    <img src={props.token.token.image} alt='token' style={{height: 60, marginRight: 16}}/>
                    <div>
                        <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{props.token.token.name}</p>
                        <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{formData.amount} {props.token.token.symbol}</p>
                    </div>

                    <RightSquareTwoTone rev={""} style={{fontSize: '3rem', marginLeft: 20}}/>
                </div>
                <div style={{fontWeight: 500}}>
                    <p>Status: {
                        idTask === -1  ? 
                            <span style={{fontWeight: 400, color: "#333"}}>Pending</span> 
                        : (taskState.taskList[taskState.taskList.length - 1 - idTask].status === 3 ? 
                            <span style={{fontWeight: 400, color: "#52c41a"}}>Success</span> 
                        : 
                            <span style={{fontWeight: 400, color: '#1677ff'}}>In Progress</span>)}
                    </p>
                    
                    <p>To: 
                        <span style={{fontWeight: 400}}> {formData.to}</span>
                    </p>
                    
                    <p>Network: 
                        <span style={{fontWeight: 400}}> {mappingNetwork(props.token.token.network)}</span>
                    </p>
                    <p>Transaction Hash:  
                        <span style={{fontWeight: 400}}> {
                            idTask === -1 ? '...' :
                            (taskState.taskList[taskState.taskList.length - 1 - idTask].status === 3 ? taskState.taskList[taskState.taskList.length - 1 - idTask].transactionHash : '...')
                        }</span>
                    </p>
                    <p>Transaction ID:  
                        <span style={{fontWeight: 400}}> {
                            idTask === -1 ? '...' :
                            (taskState.taskList[taskState.taskList.length - 1 - idTask].status === 3 ? taskState.taskList[taskState.taskList.length - 1 - idTask].orderID : '...')
                        }</span>
                    </p>
                </div>
            </Modal>
        </div>
    </div>
  )
}

export default SendToken