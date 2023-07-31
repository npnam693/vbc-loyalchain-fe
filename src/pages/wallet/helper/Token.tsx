import { Button } from "antd"
import TokenItemWallet from "../../../components/wallet/TokenItem"
import { SendOutlined, SwapOutlined } from "@ant-design/icons"
// import { fixStringBalance } from "../../../utils/string"
import SendToken from "../../../components/app/SendToken"
import { useEffect, useState } from "react"
import { getBalanceAccount, mappingCurrency } from "../../../utils/blockchain"
import { useNavigate } from "react-router-dom"
import SelectToken from "../../../components/app/SelectToken"
import { useAppDispatch, useAppSelector } from "../../../state/hooks"
import { saveInfo } from "../../../state/user/userSlice"
import { fixStringBalance } from "../../../utils/string"

const Token = ({userState} : any) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {appState} = useAppSelector(state => state)

  const [transfering, setTransfering] = useState<any>({
    open: false,
    token: {},
  });

  const [isSelectToken, setIsSelectToken] = useState(false)
  useEffect(() => {
    const getBalance = async () => {
      dispatch(saveInfo({...userState, 
        wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
        balance:fixStringBalance(String(
            await appState.web3.eth.getBalance(userState.address)
        ), 18)})
      )
    }
    getBalance()
  }, [])

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