import { Button, Input } from 'antd'
import './Faucet.scss'
import SelectToken from '../../components/app/SelectToken'
import { useState } from 'react'

const Faucet = () => {
    const [openSelect, setOpenSelect] = useState(false)
    const [tokenSelected, setTokenSelected] = useState<any>(null)
    const [selectedAmount, setSelectedAmount] = useState(0)

    return (
    <div className='app-faucet'>
        <p className='title'>Faucet Loyalty Point</p>
        <p className='desc'>Faucet Loyalty Point is a reward for users who have contributed to the development of the project.</p>
        
        <div className='app-faucet-content'>
            <Button className='select-btn' onClick={() => setOpenSelect(true)} size='large'>
                {
                    tokenSelected === null ?
                    "Select Token"
                    :
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <img src={tokenSelected.image} alt='icon' className='icon' width={26}/>
                        <p style={{marginLeft: 10, fontSize: '1.6rem', fontWeight: 700}}>{tokenSelected.symbol}</p>
                    </div>
                }
            </Button>
            <Input placeholder='Enter your address' className='input-address' size="large"/> 
            <div className='faucet-amount'>
                <div style={selectedAmount === 1 ? {backgroundColor: "var(--color-secondary"}: {}} 
                    onClick={() => setSelectedAmount(1)}
                >10 tokens</div>
                <div style={selectedAmount === 2 ? {backgroundColor: "var(--color-secondary"}: {}} 
                    onClick={() => setSelectedAmount(2)}
                >15 tokens</div>
                <div style={selectedAmount === 3 ? {backgroundColor: "var(--color-secondary"}: {}} 
                    onClick={() => setSelectedAmount(3)}
                >20 tokens</div>
            </div>
                
            <div className='faucet-btn'>
                FAUCET
            </div>
        </div>


        {
            openSelect &&
            <SelectToken 
                closeFunction={() => setOpenSelect(false)}
                onClickSelect={(token) => {setTokenSelected(token); setOpenSelect(false)}}
            />
        }
    </div>
  )
}

export default Faucet