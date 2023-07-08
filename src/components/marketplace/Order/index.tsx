import { SwapOutlined } from "@ant-design/icons";
import { Divider, Popconfirm } from "antd";
import ExchangeContract from "../../../contract/Exchange/data.json";
import TokenContract from "../../../contract/Token/data.json";
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
  const dispatch = useAppDispatch()

  const web3State = useAppSelector((state) => state.appState.web3)
  const tokenState = useAppSelector((state) => state.appState.tokens)
  const userState = useAppSelector((state) => state.userState)

  const hdClickBuyItem = async () => {
    console.log(props.data)
    // dispatch(runLoading())
    try {
      const exchangeContract = new web3State.eth.Contract(ExchangeContract.abi, MBC_EXCHANGE_ADDRESS);
      const tokenContract = new web3State.eth.Contract(TokenContract.abi, props.data.toValue.token.deployedAddress)
      const id = toast.loading("Approving token...")
      toast.update(id, { render: "Approve Token Success", type: "success", isLoading: false});

      const approveRecipt = await tokenContract.methods.approve(
        MBC_EXCHANGE_ADDRESS,
        BigInt(10 ** Number(18) * Number(props.data.toValue.amount)),
      ).send({from: userState.address})
      console.log(approveRecipt)

      toast.update(id, { render: "Buying token...", type: "default", isLoading: true});
      const acceptExchangeMethod = exchangeContract.methods.acceptTx(
        props.data.txIdFrom,
      )
      const exchangeRecepit = await web3State.eth.sendTransaction({
        from: userState.address,
        gasPrice: "0",
        gas: await acceptExchangeMethod.estimateGas({
          from: userState.address,
          data: acceptExchangeMethod.encodeABI()
        }),
        to: MBC_EXCHANGE_ADDRESS,
        value: "0",
        data: acceptExchangeMethod.encodeABI(),
      })
      console.log(exchangeRecepit)
    
      
      appApi.acceptOder(props.data._id, props.data.txIdFrom )
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
      
        dispatch(saveInfo({...userState, wallet: await getBalanceAccount(web3State, userState, tokenState)}))
        // toast.success("Accept Order Success")
        toast.update(id, { render: "The order was accepted successfully.", type: "success", isLoading: false, autoClose: 1000});

        dispatch(stopLoading())
    } catch (error) {
      alert(error);
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
