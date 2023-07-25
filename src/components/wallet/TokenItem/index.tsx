import React from 'react'
import { TokenItem } from '../../app/SelectToken/TokenItem'
import { ITokenItemProps } from '../../app/SelectToken/TokenItem';
import { SendOutlined, CopyOutlined} from '@ant-design/icons';
import './TokenItem.scss'
import { mappingNetwork } from '../../../utils/blockchain';
import { Tooltip } from 'antd';
import { toast } from 'react-toastify';

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
            
                <Tooltip title = "Copy address token.">
                    <CopyOutlined rev={""} className='action-icon'
                        onClick={() => {
                            navigator.clipboard.writeText(data.token.deployedAddress);
                            toast("Copied address token successfully!", {autoClose: 500})
                        }}
                    />
                </Tooltip>
            
                <Tooltip title="Send tokens to the destination you want." style={{textAlign:'center'}}>
                    <SendOutlined rev={""} className='action-icon' onClick={() => props.onClickSend()}/>
                </Tooltip>
            </div>
        </div>

    </div>
  )
}

export default TokenItemWallet