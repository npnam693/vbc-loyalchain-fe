import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
import { Divider, Modal, Steps } from "antd";
import ExchangeContract from "../../../contract/Exchange/data.json";
import TokenContract from "../../../contract/Token/data.json";
import "./Order.scss";
import { useAppSelector } from "../../../state/hooks";
import appApi from "../../../api/appAPI";
import { useAppDispatch } from "../../../state/hooks";
import { getBalanceAccount } from "../../../utils/blockchain";
import { toast } from "react-toastify";
import { saveInfo } from "../../../state/user/userSlice";
import { MBC_EXCHANGE_ADDRESS } from "../../../constants/contracts";
import { saveModal } from "../../../state/modal/modalSlice";
import { useState } from "react";
const Order = (props : any) => {
  const dispatch = useAppDispatch()

  const web3State = useAppSelector((state) => state.appState.web3)
  const tokenState = useAppSelector((state) => state.appState.tokens)
  const userState = useAppSelector((state) => state.userState)

  const [openModal, setOpenModal] = useState<boolean>(false);

  const approveAndBuyOrder = async () => {
    try {
      const exchangeContract = new web3State.eth.Contract(ExchangeContract.abi, MBC_EXCHANGE_ADDRESS);
      const tokenContract = new web3State.eth.Contract(TokenContract.abi, props.data.toValue.token.deployedAddress)

      const toaster = toast.loading("Approving token...")
      const approveRecipt = await tokenContract.methods.approve(
        MBC_EXCHANGE_ADDRESS,
        BigInt(10 ** Number(18) * Number(props.data.toValue.amount)),
      ).send({from: userState.address})
      console.log(approveRecipt)

      toast.update(toaster, { render: "Buying token...", type: "default", isLoading: true});
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
      const orderData = await appApi.acceptOder(props.data._id, props.data.txIdFrom )


      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(web3State, userState, tokenState)}))

      toast.update(toaster, { render: "The order was accepted successfully.", type: "success", isLoading: false, autoClose: 1000});

      dispatch(saveModal({
        open: false,
        titleModal: "Notification",
        status: "success",
        title: "Successfully Accept Order",
        subtitle: `Order ID: ${orderData ? orderData.data._id : ""}`,
        content:                     
        <>
          <p>Swap: {props.data.toValue.amount}{props.data.toValue.token.symbol} for {props.data.fromValue.amount}{props.data.fromValue.token.symbol}</p>
          <p>Transaction hash: {exchangeRecepit.blockHash}</p>
          <p>Time created: {orderData ? orderData.data.createdAt : ''}</p>
        </>
      }))

    } catch (error) {
      alert(error);
    }
  }

  const buyOrder = async() => {

  }
  const approveOrder = async() => {

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
          <div className="app-order--action--btn" onClick={() => setOpenModal(true)}>Buy</div>
      </div>

      <Modal
            title= {`Accept Order: `}
            open={openModal}
            onOk={approveAndBuyOrder}
            okText="Approve & Buy"
            width={900}
            style={{
              top: 200,
            }}
            closable={true}
            afterClose={() => {setOpenModal(false)}}
            cancelText="Approve"
            onCancel={() => {}}
        >
          <p>Order ID: {props.data._id}</p>
          <p>Owner: {props.data.from.address}</p>
          <p>Create At: {props.data.createdAt}</p>

          <Steps
              size="default"
              style={{width: 600, margin: 'auto', marginTop: 20, marginBottom: 20}}
              items={[
                {
                  title: 'Approve Token',
                  status: 'finish',
                },
                {
                  title: 'Send Token',
                  status: 'process',
                  icon: <LoadingOutlined  rev={""}/>,
                },
                {
                  title: 'Done',
                  status: 'wait',
                },
              ]}
            />

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
        </Modal>

        
    </div>
  );
};

export default Order;
