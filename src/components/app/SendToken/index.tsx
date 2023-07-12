import { useState } from 'react'
import { Button, Divider, Input, InputNumber, Modal, Result, Steps } from 'antd'

import './SendToken.scss'
import { useAppSelector } from '../../../state/hooks'
import { CloseCircleOutlined, LoadingOutlined, RightSquareTwoTone } from '@ant-design/icons'
import contractToken from '../../../contract/Token/data.json'
import { getBalanceAccount, mappingNetwork } from '../../../utils/blockchain'
import { useAppDispatch } from '../../../state/hooks'
import { saveInfo } from '../../../state/user/userSlice'
import { showConfirmConnectWallet } from '../../../pages/marketplace'
import { ITransferTask, createTask, updateTask } from '../../../state/task/taskSlice'
import appApi from '../../../api/appAPI'
import { toast } from 'react-toastify'



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
    
    const [indexTask, setIndexTask] = useState(-1)
    
    const submitSendToken = async () => {
        if (!appState.isConnectedWallet) {
            showConfirmConnectWallet()
            return
        }
        try {
            toast("Transfering Token...")
            const transferTask : ITransferTask = {
                id: taskState.taskList.length,
                type: "TRANSFER",
                status: 2,
                token: props.token.token,
                amount: formData.amount,
            }
            setIndexTask(transferTask.id)

            dispatch(createTask(transferTask))

            const contractABI = contractToken.abi; // ABI của hợp đồng bạn muốn chuyển đổi token
            const contractAddress = props.token.token.deployedAddress;
            const contract = new appState.web3.eth.Contract(contractABI, contractAddress);
            const decimal = await contract.methods.decimals().call({
                from: userState.address,
            });
            const amount: BigInt = BigInt(10 ** Number(decimal) * formData.amount); // Số lượng token bạn muốn chuyển (1 token = 10^18 wei)
            
            const myReceipt = await contract.methods.transfer(formData.to, amount).send({
                from: userState.address,
                gas: await contract.methods.transfer(formData.to, amount).estimateGas({
                  from: userState.address,
                  data: contract.methods.transfer(formData.to, amount).encodeABI(),
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
            toast.success("Transfer Token successfully!")
        } catch (error) {
            console.log(error)
            toast.error("Transfer Token Failed!")
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
                onClick={() => setOpenModal(true)}
            >
                Send
                
            </Button>
            <Modal
                title="Transfer Token"
                open={openModal}
                
                onOk={indexTask === -1 ? submitSendToken : () => {setOpenModal(false)}}
                okText= {indexTask === -1 ? "Confirm" : 'OK'}

                cancelText="Cancel"
                onCancel={() => {setOpenModal(false)}}

                width={700}
                style={{top: 200}}
                
                closable={true}
            >
                <Steps
                    size="default"
                    style={{width: 400, margin: 'auto', marginTop: 20, marginBottom: 20}}
                    items={[
                        indexTask !== -1 ? {
                            title: 'Send Token',
                            status: taskState.taskList[indexTask].status === -1 ? 'error' : 
                                    (taskState.taskList[indexTask].status === 3 ? 'finish' : 'process'),
                            icon: taskState.taskList[indexTask].status === 2 && <LoadingOutlined  rev={""}/>,
                        }
                        :
                        {
                            title: 'Send Token',
                            status: 'wait'
                        }
                        ,
                        indexTask === -1 ? {
                            title: 'Done',
                            status: 'wait',
                        }
                        :
                        {
                            title: 'Done',
                            status: taskState.taskList[indexTask].status === 3 ? 'finish' : 'wait'
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
                        indexTask === -1  ? 
                            <span style={{fontWeight: 400, color: "#333"}}>Pending</span> 
                        : (taskState.taskList[indexTask].status === 3 ? 
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
                            indexTask === -1 ? '...' :
                            (taskState.taskList[indexTask].status === 3 ? taskState.taskList[indexTask].transactionHash : '...')
                        }</span>
                    </p>
                    <p>Transaction ID:  
                        <span style={{fontWeight: 400}}> {
                            indexTask === -1 ? '...' :
                            (taskState.taskList[indexTask].status === 3 ? taskState.taskList[indexTask].orderID : '...')
                        }</span>
                    </p>
                </div>
            </Modal>
        </div>
    </div>
  )
}

export default SendToken