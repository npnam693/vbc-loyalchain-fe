import { SwapOutlined } from "@ant-design/icons";
import { Divider, Popconfirm } from "antd";
import ExchangeContract from "../../../contract/Exchange/data.json";
import "./Order.scss";
import { useAppSelector } from "../../../state/hooks";
import appApi from "../../../api/appAPI";
import { useAppDispatch } from "../../../state/hooks";
import { runLoading, stopLoading } from "../../../state/loading/loadingSlice";
import { getBalanceAccount } from "../../../utils/blockchain";
import { toast } from "react-toastify";
import { saveInfo } from "../../../state/user/userSlice";
import { MBC_EXCHANGE_ADDRESS } from "../../../constants/contracts";
const Order = (props : any) => {
  const web3State = useAppSelector((state) => state.appState.web3)
  const tokenState = useAppSelector((state) => state.appState.tokens)
  const userState = useAppSelector((state) => state.userState)

  const dispatch = useAppDispatch()


  const hdClickBuyItem = async () => {
    console.log(props.data)
    dispatch(runLoading())
    try {
      const contract = new web3State.eth.Contract(ExchangeContract.abi, MBC_EXCHANGE_ADDRESS);
      
      console.log('ontract', contract)
      const dataMethod = contract.methods.acceptTx(
        props.data.txIdFrom,
        userState.signature  
      )
      // console.log('ccc', dataMethod)
      // console.log(Number(await web3State.eth.net.getId()))

      // const infoMethod = await contract.methods.txInfo(props.data.txIDFrom).call({
      //   from: userState.address,
      // })
      
      // console.log("info", infoMethod)
      
      const estimateGas = await dataMethod.estimateGas({
        from: userState.address,
        data: dataMethod.encodeABI()
      })
      
      console.log('gas', estimateGas)

      
      const dataABI = dataMethod.encodeABI()

      console.log(dataABI)
    
      const sendTX = await web3State.eth.sendTransaction({
        from: userState.address,
        gasPrice: "0",
        gas: estimateGas ,
        to: MBC_EXCHANGE_ADDRESS,
        value: "0",
        data: dataABI,
      })
      
      console.log(sendTX)
    
      appApi.acceptOder(props.data._id, props.data.txIdFrom )
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
      

      let myUserState = Object.assign({}, userState);

      console.log('trc khi', userState)

      const wallet = await getBalanceAccount(web3State, myUserState, tokenState)

      console.log(wallet)
      console.log('sau khi', myUserState)
      toast.success("Accept Order Success")
      // dispatch(saveInfo({...myUserState, wallet: wallet}))
      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(web3State, userState, tokenState)}))
      dispatch(stopLoading())
    } catch (error) {
      alert("Error");
      dispatch(stopLoading())
    }
  }


  return (
    <div className="app-order" style={{marginBottom: 20}}>
      <div className="app-order--info">



        <div className="app-order--info--token">
          <img src={props.data.toValue.token.image} alt="StarBuck" />
          <div>
            <p className="quantity">{props.data.toValue.amount}</p>
            <p className="symbol">{props.data.toValue.token.symbol}</p>
          </div>
        </div>
      
        <div className="icon-container">
          <SwapOutlined rev={""} className="icon" />
        </div>


        <div className="app-order--info--token">
            <img src={props.data.fromValue.token.image} alt="StarBuck" />
            <div>
              <p className="quantity">{props.data.fromValue.amount}</p>
              <p className="symbol">{props.data.fromValue.token.symbol}</p>
            </div>
          </div>
      
      </div>




      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      <div className="app-order--action">
        <div className="app-order--action--time_left">3h 50m 2s left</div>


        <Popconfirm
          title="Accept the Order"
          description="Are you sure to accept the Order??"
          onConfirm={hdClickBuyItem}
          onCancel={() => console.log("cancel")}
          okText="Yes"
          cancelText="No"
          placement="bottom"
        >
          <div className="app-order--action--btn" >Buy</div>
        </Popconfirm>
      </div>
    </div>
  );
};

export default Order;
