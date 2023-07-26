import { CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons'
import './HistoryItem.scss'
import PairToken from '../../app/PairToken'
import { useAppSelector } from '../../../state/hooks'




const HistoryItem = (props : any) => {
    const data = props.data
    const {userState} = useAppSelector(state => state)
    
    const IS_TRANSFER = data.transactionType === "transfer"
    const IS_SELLER = !IS_TRANSFER && data.from.address === userState.address

    return (
        <div className='history-item-container'>
            <div style={{ 
                display:'flex', flexDirection:'row', alignItems:"center", justifyContent:'space-between',
                padding: "3px 20px 3px 14px",   margin: "5px 0", borderRadius: 3, 
                backgroundColor: 'rgba(219, 219, 219, 0.4)'}}
            >
                <div>
                    <p
                        className='history-title'
                    >{IS_TRANSFER ? "Transfer Token" : "Swap Order - " + 
                        (IS_SELLER ? "Sell Token" : "Buy Token")  
                    }</p>
                    
                    <p className='history-info'>Recipient: 
                        <span> {" "}
                        {IS_SELLER ? data.to.address : data.from.address}
                        </span>
                    </p>
                    <p className='history-info'>Order ID:
                        <span> {" "}
                        {data._id}
                        </span>
                    </p>
                    <p className='history-info'>Time completed:
                        <span> {" "}
                        {data.updatedAt}
                        </span>
                    </p>

                </div>
                
                <div style={{minWidth: 100}}>
                    {
                    data.transactionType === "transfer" ? 
                        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                            <img src={data.fromValue.token ? data.fromValue.token.image : 'token'} alt={""} style={{height: 50, marginRight: 20}}/>
                            <p style={{fontWeight: 600, color: data.from.address !== userState.address ? "greenyellow" : '#ddd', fontSize: '1.4rem', minWidth: 70}}>
                                {data.from.address === userState.address ? '-' : '+'}{data.fromValue.amount} {data.fromValue.token.symbol}</p>
                        </div>
                    :
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <PairToken from_img={data.fromValue.token.image} to_img={data.toValue.token.image} width={50}/>
                        
                        <div style={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                            <p style={{fontWeight: 600, color: !IS_SELLER ? 'greenyellow' : '#ddd', fontSize: '1.4rem', minWidth: 70}}>{!IS_SELLER ? "+" : "-"}{data.fromValue.amount} {data.fromValue.token.symbol}</p>
                            <p style={{fontWeight: 600, color: IS_SELLER ? 'greenyellow' : '#ddd', fontSize: '1.4rem', minWidth: 70}}>{IS_SELLER ? "+" : "-"}{data.toValue.amount} {data.toValue.token.symbol}</p>
                        </div>
                    </div>
                    }
                </div>
            </div>
            
        </div>
  )
}

export default HistoryItem