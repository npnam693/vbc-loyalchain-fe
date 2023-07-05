import React, { useState } from "react";
import "./CreateOrder.scss";
import SBP from "../../assets/svg/tokens/starbuck.svg";
import { DownOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Divider, InputNumber } from "antd";
import PairToken from "../../components/app/PairToken";
import SelectToken from "../../components/app/SelectToken";
import { useAppSelector } from "../../state/hooks";
import ExchangeContract from '../../contract/Exchange/data.json'
import { v4 as uuidv4 } from 'uuid';
import appApi from "../../api/appAPI";
import { useAppDispatch } from "../../state/hooks";
import { stopLoading, runLoading } from "../../state/loading/loadingSlice";
import { toast } from 'react-toastify'
import { getBalanceAccount } from "../../utils/blockchain";
import { initialUserState, saveInfo } from "../../state/user/userSlice";
import { use } from "i18next";

interface IFormData {
  from: any;
  from_amount: number;
  to: any;
  to_amount: number;
  timelock: number;
}

export default function CreateOrder() {
  const [formData, setFormData] = useState<IFormData>({
    from: '',
    from_amount: 0,
    to: '',
    to_amount: 10,
    timelock: 0,
  });
  const [selectingTokenFrom, setSelectingTokenFrom] = useState<boolean>(false);
  const [selectingTokenTo, setSelectingTokenTo] = useState<boolean>(false);
  const web3State = useAppSelector((state) => state.Web3State)
  const userState = useAppSelector((state) => state.userState)
  const tokenState = useAppSelector((state) => state.tokenState)
  const dispatch =useAppDispatch()


  const hdClickSwap = () => {
    const newData: IFormData = {
      from: formData.to,
      from_amount: formData.to_amount,
      to: formData.from,
      to_amount: formData.from_amount,
      timelock: formData.timelock,
    };
    setFormData(newData);
  };
  const hdClickCreate = async () => {
    console.log(formData)
    dispatch(runLoading({isLoading: true}))
    const orderId = uuidv4();
    const contract = new web3State.web3.eth.Contract(ExchangeContract.abi, "0xF6e3c3172D6Ef1751855cE091f2F60Cbf5D2EDC2");
    const data = contract.methods.createTx(
      orderId, 
      formData.from.token.deployedAddress,
      formData.to.token.deployedAddress,
      BigInt(10 ** Number(18) * Number(formData.from_amount)),
      BigInt(10 ** Number(18) * Number(formData.to_amount)),
      BigInt(24),
    )

    console.log(data.encodeABI())
    console.log();

    const sendTX = await web3State.web3.eth.sendTransaction({
      from: userState.address,
      gasPrice: "20000000000",
      gas: await data.estimateGas({
        from: userState.address,
        data: data.encodeABI()
      }) ,
      to: "0xF6e3c3172D6Ef1751855cE091f2F60Cbf5D2EDC2",
      value: "0",

      data: data.encodeABI(),
    })

    
    appApi.createOrder( {
      fromValue: formData.from_amount,
      fromTokenId: formData.from.token._id,
      toValue: formData.to_amount,
      toTokenId: formData.to.token._id,
      transactionType: 'exchange',
      timelock: 24,
      hashlock: 'cccc',
      txIdFrom: orderId
    })
    
    console.log(sendTX)
    

    let myUserState = Object.assign({}, initialUserState);
    myUserState.address = userState.address
    myUserState.balance = userState.balance
    myUserState.isAuthenticated = userState.isAuthenticated
    myUserState.network = userState.network
    myUserState.token = userState.token
    myUserState.wallet = []
    console.log('trc khi', userState)

    await getBalanceAccount(web3State.web3, myUserState, tokenState)
    

    console.log('sau khi', myUserState)

    dispatch(saveInfo(myUserState))


    toast.success("The order was created successfully");
    dispatch(stopLoading())
  };

  const hdClickSelectTokenFrom = () => {
    setSelectingTokenFrom(!selectingTokenFrom);
  };

  const hdClickSelectTokenTo = () => {
    setSelectingTokenTo(!selectingTokenTo);
  };



  return (
    <div className="app-create">
      <p className="title">Swap</p>
      <p className="title--desc">Easy way to exchange your loyalty points</p>

      <div className="content">
        <div className="form">
          <div className="form-input">
            <div className="form-input--header">
              <p>From</p>
              {formData.from !== "" ? (
                <div
                  className="form-input--header--token"
                  onClick={hdClickSelectTokenFrom}
                >
                  <img src={formData.from.token.image || SBP} alt="Token" />
                  <p>{formData.from.token.symbol}</p>
                  <DownOutlined rev="" style={{ fontSize: "1.4rem" }} />
                </div>
              ) : (
                <Button
                  onClick={hdClickSelectTokenFrom}
                  className="btn-select_token"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: "1.4rem",
                  }}
                >
                  <p>Select a token</p>
                  <DownOutlined
                    rev=""
                    style={{ fontSize: "1.4rem", marginLeft: 10 }}
                  />
                </Button>
              )}
            </div>

            <div className="form-input--content">
              <InputNumber
                placeholder="0.0"
                min={0}
                value={formData.from_amount}
                onChange={(e) =>
                  setFormData({ ...formData, from_amount: Number(e) })
                }
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button onClick={() => setFormData({...formData, from_amount:Number(formData.from.balance)})}>MAX</Button>
                <p>Available: {formData.from.balance}</p>
              </div>
            </div>
          </div>

          <div
            className="icon-container"
            onClick={hdClickSwap}
            style={{ cursor: "pointer" }}
          >
            <SwapOutlined rev={""} className="icon" />
          </div>

          <div className="form-input">
            <div className="form-input--header">
              <p>To</p>
              {formData.to !== "" ? (
                <div
                  className="form-input--header--token"
                  onClick={hdClickSelectTokenTo}
                >
                  <img src={formData.to.token.image || SBP} alt="Token" />
                  <p>{formData.to.token.symbol}</p>
                  <DownOutlined rev="" style={{ fontSize: "1.4rem" }} />
                </div>
              ) : (
                <Button
                  onClick={hdClickSelectTokenTo}
                  className="btn-select_token"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: "1.4rem",
                  }}
                >
                  <p>Select a token</p>
                  <DownOutlined
                    rev=""
                    style={{ fontSize: "1.4rem", marginLeft: 10 }}
                  />
                </Button>
              )}
            </div>

            <div className="form-input--content">
              <InputNumber
                placeholder="0.0"
                min={0}
                value={formData.to_amount}
                onChange={(e) =>
                  setFormData({ ...formData, to_amount: Number(e) })
                }
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button onClick={() => setFormData({...formData, to_amount:Number(formData.to.balance)})}>MAX</Button>
                <p>Available: {formData.to.balance}</p>
              </div>
            </div>
          </div>
        </div>

        <Divider type="vertical" className="divider" />

        <div className="info">
          <div className="average">
            <p className="info-title">Average exchange rate</p>
            <div className="pair">
              <PairToken from_img={formData.from !== '' ? formData.from.token.image : SBP} to_img={formData.to !== '' ? formData.to.token.image : SBP} />
              <p className="average">{1.005}</p>
            </div>
          </div>

          <div className="locktime">
            <p className="info-title">Time Lock</p>
            <div className="input-time">
              <InputNumber min={0} placeholder="24" />
              <p>hours</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="primary"
        onClick={hdClickCreate}
        className="btn-create-order"
      >
        Create
      </Button>

      {selectingTokenFrom && (
        <SelectToken closeFunction={hdClickSelectTokenFrom} 
          onClickSelect={(token: any) => {
            setFormData({...formData, from: token})
            hdClickSelectTokenFrom()
          }}
        />
      )}

      {selectingTokenTo && (
        <SelectToken closeFunction={hdClickSelectTokenTo} 
          onClickSelect={(token: any) => {
            hdClickSelectTokenTo()
            setFormData({...formData, to: token})
          }}
        />
      )}
    </div>
  );
}
