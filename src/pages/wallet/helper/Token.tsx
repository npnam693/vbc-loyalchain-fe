import { Button } from "antd"
import TokenItemWallet from "../../../components/wallet/TokenItem"
import { SendOutlined, SwapOutlined } from "@ant-design/icons"
// import { fixStringBalance } from "../../../utils/string"
import SendToken from "../../../components/app/SendToken"
import { useState } from "react"
import { mappingCurrency } from "../../../utils/blockchain"

const Token = ({userState} : any) => {
  const [transfering, setTransfering] = useState<any>({
    open: false,
    token: {},
  });

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
                // onClickItem={() => console.log(data.token.address)}
                data={data}
                key={index}
                onClickSend={() => setTransfering({open: true, token: data}) }
                // name={data.token.name}
                // network={data.token.network}
                // symbol={data.token.symbol}
                // balance={data.balance}
                // uriImg={data.token.image}
              />
            ))
          }
        </div>
    </div>
  )
}

export default Token