import React from 'react'
import { TokenItem } from '../../app/SelectToken/TokenItem'
import { ITokenItemProps } from '../../app/SelectToken/TokenItem';
import { SendOutlined, SwapOutlined, InfoCircleOutlined} from '@ant-design/icons';
import './TokenItem.scss'
import Token from '../../../assets/svg/tokens/SAP.svg'


const TokenItemWallet = (props: ITokenItemProps) => {
  return (
    <div className='wallet-token-item'>
        <div className='token-item-left'>
            <img src={Token} alt="Token" />
            <div className='name_network-token'>
                <p className='name'>{props.name}</p>
                <p className='network'>{props.network}</p>
            </div>
        </div>

        <div className='token-item-right'>
            <p className='balance-token'>{props.balance} {props.symbol}</p>        

            <div className='action-token'>
                <InfoCircleOutlined rev={""} className='action-icon'/>
                <SendOutlined rev={""} className='action-icon'/>
                <SwapOutlined rev={""} className='action-icon'/>
            </div>
        </div>

    </div>
  )
}

export default TokenItemWallet