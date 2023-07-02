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
            <TokenItemWallet 
              onClickItem={() => console.log(mockDataToken[0].address)}
              name={mockDataToken[0].name}
              network={mockDataToken[0].network}
              symbol={mockDataToken[0].symbol}
              balance={mockDataToken[0].balance}
              uriImg={mockDataToken[0].uriImg}
            />
                        <TokenItemWallet 
              onClickItem={() => console.log(mockDataToken[0].address)}
              name={mockDataToken[0].name}
              network={mockDataToken[0].network}
              symbol={mockDataToken[0].symbol}
              balance={mockDataToken[0].balance}
              uriImg={mockDataToken[0].uriImg}
            />
        </div>
    </div>
  )
}

export default Token