import { useState } from 'react'
import { Button, Divider, Input, InputNumber } from 'antd'

import './SendToken.scss'
import { useAppSelector } from '../../../state/hooks'
import { CloseCircleOutlined } from '@ant-design/icons'
import contractToken from '../../../contract/Token/data.json'
import { getBalanceAccount, mappingNetwork } from '../../../utils/blockchain'
import { useAppDispatch } from '../../../state/hooks'
import { runLoading, stopLoading } from '../../../state/loading/loadingSlice'
import { saveInfo } from '../../../state/user/userSlice'
interface ISendToken {
    token?: any;
    onCloseBtn: () => void
}
const SendToken = (props : ISendToken) => {
    const dispatch = useAppDispatch()
    const userState = useAppSelector((state) => state.userState);
    const tokenState = useAppSelector((state) => state.appState.tokens); 
    const appState = useAppSelector((state) => state.appState); 

    const [formData, setFormData] = useState({
        token: {},
        amount: 0,
        to: "",
    })
    
    const onSubmitSendToken = async () => {
        if (!appState.isConnectedWallet) {
            alert("M can phai dang nhap trc");
            return;
        }
        dispatch(runLoading())

        try {
            const contractABI = contractToken.abi; // ABI của hợp đồng bạn muốn chuyển đổi token
            const contractAddress = props.token.token.deployedAddress;
            const contract = new appState.web3.eth.Contract(contractABI, contractAddress);
    
            const fromAddress = userState.address; // Địa chỉ ví nguồn (tài khoản của bạn)
            const toAddress = formData.to; // Địa chỉ ví đích
    
            const decimal = await contract.methods.decimals().call({
                from: fromAddress,
            });
    
            const amount: BigInt = BigInt(10 ** Number(decimal) * formData.amount); // Số lượng token bạn muốn chuyển (1 token = 10^18 wei)
            
            const myReceipt = await contract.methods.transfer(toAddress, amount).send({
                from: userState.address,
                gas: await contract.methods.transfer(toAddress, amount).estimateGas({
                  from: userState.address,
                  data: contract.methods.transfer(toAddress, amount).encodeABI(),
                }),
                gasPrice: "0"
            });

            dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, tokenState)}))
            alert("Giao dich thanh cong")
            console.log(myReceipt)
            dispatch(stopLoading())
        } catch (error) {
            alert("Giao dich that bai")
            console.log(error)
            dispatch(stopLoading())
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
                <InputNumber min={0} className='amount-input'
                    value={formData.amount}
                    onChange={(val) => setFormData({ ...formData, amount: Number(val) })}
                />
                <Button className='amount-btn'
                    onClick={() => setFormData({ ...formData, amount: Number(props.token.balance) })}
                >MAX</Button>
            </div>

            <Button type='primary' className='send-btn' size='large' 
                onClick={onSubmitSendToken}
            >Send</Button>
        </div>
    </div>
  )
}

export default SendToken