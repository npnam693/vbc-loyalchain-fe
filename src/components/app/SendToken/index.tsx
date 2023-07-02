import { Button, Divider, Input, InputNumber } from 'antd'
import Token from '../../../assets/svg/tokens/SAP.svg'
import { CloseCircleOutlined } from '@ant-design/icons'
import './SendToken.scss'
import { useAppSelector } from '../../../state/hooks'

interface ISendToken {
    isSelectedToken: boolean;
    onCloseBtn: () => void
}

const SendToken = (props : ISendToken) => {
    const userStatate = useAppSelector((state) => state.userState);

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
            <p className='user-address'>From: <span>{userStatate.address}</span></p>
            <p className='token-balance'>Your balance: <span>1000 SAP</span></p>
            <div className='sendto'>
                <p>Send to</p>
                <Input placeholder='Recipient Address'/>
            </div>
            <div className='amount'>
                <p>Amount</p>
                <InputNumber min={0} className='amount-input'/>
                <Button className='amount-btn'>MAX</Button>
            </div>

            <Button type='primary' className='send-btn' size='large'>Send</Button>
        </div>
    </div>
  )
}

export default SendToken