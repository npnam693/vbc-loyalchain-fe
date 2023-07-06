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
const Order = (props : any) => {
  const web3State = useAppSelector((state) => state.appState.web3)
  const tokenState = useAppSelector((state) => state.appState.tokens)
  const userState = useAppSelector((state) => state.userState)

  const dispatch = useAppDispatch()


  const hdClickBuyItem = async () => {
    console.log(props.data)
    dispatch(runLoading())
    try {
      const contract = new web3State.web3.eth.Contract(ExchangeContract.abi, "0xF6e3c3172D6Ef1751855cE091f2F60Cbf5D2EDC2");
      
      const dataMethod = contract.methods.accept(props.data.txIdFrom)

      const dataABI = dataMethod.encodeABI()

      console.log(dataABI)
    
      const estimateGas = await dataMethod.estimateGas({
        from: userState.address,
        data: dataMethod.encodeABI()
      })
      
      const sendTX = await web3State.web3.eth.sendTransaction({
        from: userState.address,
        gasPrice: "20000000000",
        gas: estimateGas ,
        to: "0xF6e3c3172D6Ef1751855cE091f2F60Cbf5D2EDC2",
        value: "0",
        data: dataABI,
      })
      
      console.log(sendTX)
    
      appApi.acceptOder(props.data._id, props.data.txIdFrom )
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
      

      let myUserState = Object.assign({}, userState);


      console.log('trc khi', userState)

      const wallet = await getBalanceAccount(web3State.web3, myUserState, tokenState)

      console.log(wallet)
      console.log('sau khi', myUserState)
      toast.success("Accept Order Success")
      // dispatch(saveInfo({...myUserState, wallet: wallet}))
      
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
