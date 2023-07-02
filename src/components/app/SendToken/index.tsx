import { Button, Divider, Input, InputNumber } from 'antd'
import Token from '../../../assets/svg/tokens/SAP.svg'
import { CloseCircleOutlined } from '@ant-design/icons'
import './SendToken.scss'
import { useAppSelector } from '../../../state/hooks'
import contractToken from '../../../contract/Token/data.json'
import { useState } from 'react'
interface ISendToken {
    isSelectedToken: boolean;
    token?: any;
    onCloseBtn: () => void
}

const SendToken = (props : ISendToken) => {
    const userState = useAppSelector((state) => state.userState);
    const web3State = useAppSelector((state) => state.Web3State); 

    const [formData, setFormData] = useState({
        token: "",
        amount: 0,
        to: "",
    })
    
    const onSubmitSendToken = async () => {
        if (!web3State.isConnected) {
            alert("M can phai dang nhap trc");
            return;
        }

        const contractABI = contractToken.abi; // ABI của hợp đồng bạn muốn chuyển đổi token
        const contractAddress = formData.token;
        const contract = new web3State.web3.eth.Contract(contractABI, contractAddress);

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
          });
      
        console.log("myReceipt", myReceipt);
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
                <img src={Token} alt='token' className='token-img'/>            
                <div>
                    <p className='token-name'>Singapore Airlines Loyalty Point</p>
                    <p className='token-net'>AGD Network</p>
                </div>
            </div>
            <p className='user-address'>From: <span>{userState.address}</span></p>
            <p className='token-balance'>Your balance: <span>1000 SAP</span></p>
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
                <Button className='amount-btn'>MAX</Button>
            </div>

            <Button type='primary' className='send-btn' size='large' 
                onClick={onSubmitSendToken}
            >Send</Button>
        </div>
    </div>
  )
}

export default SendToken