import { Button } from "antd"
import TokenItemWallet from "../../../components/wallet/TokenItem"
import { mockDataToken } from "../../../components/app/SelectToken"
import { SendOutlined, SwapOutlined } from "@ant-design/icons"
// import { fixStringBalance } from "../../../utils/string"
import SendToken from "../../../components/app/SendToken"
import { useState } from "react"

const Token = ({userState} : any) => {
  const [transfering, setTransfering] = useState<boolean>(false);

  return (
      <div className="app-wallet--token">
        {
          transfering &&
          <SendToken isSelectedToken={false} onCloseBtn={() => setTransfering(false)}/>
        }
        <p className="balance">{userState.balance} AGD</p>
        <div className="wallet-action">
            <Button type="primary" size="large" onClick={() => setTransfering(true)}>
              <SendOutlined rev={""} className='action-icon'/>
              Send
            </Button>
            <Button type="primary" size="large">
              Swap
              <SwapOutlined rev={""} className='action-icon'/>
            </Button>
        </div>

        <div className="token-items">
          {
            userState.wallet.map((data : any, index:number) => (
              <TokenItemWallet 
                onClickItem={() => console.log(data.token.address)}
                name={data.token.name}
                network={data.token.network}
                symbol={data.token.symbol}
                balance={data.balance}
                uriImg={data.token.image}
              />
            ))
          }
        </div>
    </div>
  )
}

export default Token