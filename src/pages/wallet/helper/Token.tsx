import { Button } from "antd"
import TokenItemWallet from "../../../components/wallet/TokenItem"
import { SendOutlined, SwapOutlined } from "@ant-design/icons"
// import { fixStringBalance } from "../../../utils/string"
import SendToken from "../../../components/app/SendToken"
import { useState } from "react"
import { mappingCurrency } from "../../../utils/blockchain"
import { useNavigate } from "react-router-dom"
import SelectToken from "../../../components/app/SelectToken"

const Token = ({userState} : any) => {
  const navigate = useNavigate()
  
  const [transfering, setTransfering] = useState<any>({
    open: false,
    token: {},
  });

  const [isSelectToken, setIsSelectToken] = useState(false)


  return (
      <div className="app-wallet--token">
        {
          transfering.open &&
          <SendToken onCloseBtn={() => setTransfering({open:false, token: {}})}
            token={transfering.token}
          />
        }
        <p className="balance">{userState.balance} {mappingCurrency((userState.network))}</p>
        <div className="wallet-action">
            <Button type="primary" size="large" onClick={() => setIsSelectToken(true)}>
              <SendOutlined rev={""} className='action-icon'
              />
              Send
            </Button>
            <Button type="primary" size="large" onClick={() => navigate('/marketplace/create')}>
              Swap
              <SwapOutlined rev={""} className='action-icon'/>
            </Button>
        </div>

        <div className="token-items">
          {
            userState.wallet.map((data : any, index:number) => (
              <TokenItemWallet 
                data={data}
                key={index}
                onClickSend={() => setTransfering({open: true, token: data}) }
              />
            ))
          }
        </div>

        
        {
          isSelectToken &&
          <SelectToken
            closeFunction={() => setIsSelectToken(false)}
            onClickSelect={(token : any) => {
              setIsSelectToken(false)
              setTransfering({open: true, token: token})
            }}
            isCheckNetwork={true}
          />
        }
    </div>
  )
}

export default Token