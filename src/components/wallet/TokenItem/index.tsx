import React from 'react'
import { TokenItem } from '../../app/SelectToken/TokenItem'
import { ITokenItemProps } from '../../app/SelectToken/TokenItem';
import { SendOutlined, SwapOutlined, InfoCircleOutlined} from '@ant-design/icons';
import './TokenItem.scss'
import { mappingNetwork } from '../../../utils/blockchain';

const TokenItemWallet = (props : any) => {
    const data = props.data
    return (
        <div className='wallet-token-item'>
            <div className='token-item-left'>
                <img src={data.token.image} alt="Token" />
                <div className='name_network-token'>
                    <p className='name'>{data.token.name}</p>
                    <p className='network'>{mappingNetwork(Number(data.token.network))}</p>
                </div>
            </div>

        <div className='token-item-right'>
            <p className='balance-token'>{data.balance} {data.token.symbol}</p>        

            <div className='action-token'>
                <InfoCircleOutlined rev={""} className='action-icon'/>
                <SendOutlined rev={""} className='action-icon' onClick={() => props.onClickSend()}/>
                <SwapOutlined rev={""} className='action-icon'/>
            </div>
        </div>

    </div>
  )
}

export default TokenItemWallet