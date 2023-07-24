import { DownOutlined, LoadingOutlined, SwapOutlined, WarningOutlined,} from "@ant-design/icons";
import { Button, Divider, InputNumber, Modal, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import "./CreateOrder.scss";
import appApi from "../../../api/appAPI";
import { saveInfo } from "../../../state/user/userSlice";
import PairToken from "../../../components/app/PairToken";
import SelectToken from "../../../components/app/SelectToken";
// import { MBC_EXCHANGE_ADDRESS } from "../../constants/contracts";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { getBalanceAccount, getBalanceToken } from "../../../utils/blockchain";
import { ITask, ITaskState, createTask, doneOneTask, updateTask,} from "../../../state/task/taskSlice";
import { getTokenContract, getSwapOneContract } from "../../../services/contract";
import { getAddressOneChainContract } from "../../../utils/blockchain";

interface IFormData {
  from: {
    token: any,
    amount: number,
    balance: number
  }
  to: {
    token: any,
    amount: number,
    balance: number,
  }
}

export default function CreateOrder() {
  const dispatch = useAppDispatch();
  const {appState, userState, taskState}= useAppSelector(state => state);
  const [formData, setFormData] = useState<IFormData>({
    from: {
      token: "",
      amount: 0,
      balance: 0
    },
    to: {
      token: "",
      amount: 0,
      balance: 0
    },
  });
  const [selectingTokenFrom, setSelectingTokenFrom] = useState<boolean>(false);
  const [selectingTokenTo, setSelectingTokenTo] = useState<boolean>(false);
  const [isOneChain, setIsOneChain] = useState<boolean>(true);
  const [rate, setRate] = useState("0.000");

  const hdClickSwap = () => {
    const newData: IFormData = {
      from: formData.to,
      to: formData.from,
    };
    setFormData(newData);
    
  };
  
  const countExchangeRateForm = async () => {
    const res = await appApi.getExchangeRate({
      tokenId1: formData.from.token._id,
      tokenId2: formData.to.token._id,
    });
    setRate(String(res?.data));
  };
  useEffect(() => {
    if(formData.from.token !== "" && formData.to.token !== ""){
      countExchangeRateForm();
    }
  }, [formData])

  const onClickCreate = async () => {
    if (formData.from.token === "" || formData.to.token === "") {
      alert("Please select token");
      return;
    }
    if (formData.from.amount <= 0) {
      alert("Please input amount");
      return;
    }
    if (formData.from.amount > formData.from.balance) {
      alert("Insufficient balance");
      return;
    }
    if (formData.from.token.deployedAddress === formData.to.token.deployedAddress) {
      alert("Please select different token");
      return;
    }
    if (formData.from.token.symbol === formData.to.token.symbol) {
      alert("Please select different token");
      return;
    }
    if (isOneChain){
      let myTask: ITask = {
        id: taskState.taskList.length,
        type: "CREATE",
        status: 0,
        funcExecute: createOrderOneChain,
        from: {address: userState.address, token: formData.from.token, amount: formData.from.amount},
        to: {address: userState.address, token: formData.to.token, amount: formData.to.amount}
      };
      dispatch(createTask(myTask))
    } else {
        let myTask: ITask = {
          id: taskState.taskList.length,
          type: "SELLER-CREATE",
          status: 0,
          funcExecute: createOrderTwoChain,
          from: {address: userState.address, token: formData.from.token, amount: formData.from.amount},
          to: {address: userState.address, token: formData.to.token, amount: formData.to.amount}
        };
        dispatch(createTask(myTask))
    }
  };

  const createOrderOneChain = async (taskState: ITaskState, idTask: number) => {
    const orderId = appState.web3.utils.soliditySha3(uuidv4());
    const toastify = toast.loading("Approving token...");
    let task : ITask = {...taskState.taskList[idTask], status: 1}
    dispatch(updateTask({task, id: idTask}))
    try {
      const SWAP_CONTRACT_ADDRESS = getAddressOneChainContract(userState.network)
      const swapContract = getSwapOneContract(appState.web3, userState.network)
      const tokenContract = getTokenContract(appState.web3, formData.from.token.deployedAddress)

      // Approve token
      await tokenContract.methods.approve(
        SWAP_CONTRACT_ADDRESS,
        BigInt(10 ** Number(18) * Number(formData.from.amount))
      )
      .send({ from: userState.address });
      toast.update(toastify, { render: "Successfully approve token", type: "success", isLoading: false, autoClose: 500});
      task = {...task, status: 2}
      dispatch(updateTask({task, id: idTask}))

      toast.update(toastify, {
        render: "Sending token...",
        type: "default", isLoading: true,
      });

      // Create order in smart contract 
      const createRecipt = await swapContract.methods.createTx(
        orderId,
        formData.from.token.deployedAddress,
        formData.to.token.deployedAddress,
        BigInt(10 ** Number(18) * Number(formData.from.amount)),
        BigInt(10 ** Number(18) * Number(formData.to.amount)),
      ).send({from: userState.address})
      
      console.log(createRecipt)
      // Save order to database
      const orderData = await appApi.createOrder({
        fromValue: formData.from.amount,
        fromTokenId: formData.from.token._id,
        toValue: formData.to.amount,
        toTokenId: formData.to.token._id,
        contractId: orderId,
      });
      
      dispatch(saveInfo({
        ...userState,
        wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
      }))

      toast.update(toastify, {
        render: "The order was created successfully.",
        type: "success", isLoading: false, autoClose: 1000,
      });
      
      task = {...task,           
        status: 3,
        transactionHash: createRecipt.transactionHash,
        orderID: orderData && orderData.data._id
      }
      dispatch(updateTask({task, id: idTask}))
    } catch (error) {
      console.log(error);
      toast.update(toastify, {
        render: "The order was created fail, see detail in console.",
        type: "error", isLoading: false, autoClose: 1000,
      });
      dispatch(updateTask({
        task: {
          ...task,
          status: task.status === 1 ? -1 : -2,
        },
        id: task.id,
      }));
    }
    dispatch(doneOneTask())
  };
  
  const createOrderTwoChain = async (taskState: ITaskState, idTask: number) => {
    let task : ITask = {...taskState.taskList[idTask], status: 1}
    const toastify = toast.loading("Check your balance...");
    dispatch(updateTask({task, id: idTask}))
    try {
      const balance = await getBalanceToken(appState.web3, userState, formData.from.token)
      if (Number(balance) < Number(formData.from.amount)) {
        toast.update(toastify, {
          render: "Insufficient balance",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
        task={...task, status: -1}
        dispatch(updateTask({task, id: task.id}))
        return;
      }

      dispatch(updateTask({task:{...task, status: 2}, id: task.id}))
      toast.update(toastify, {
        render: "Save order...",
        type: "default",
        isLoading: true,
      });

      const dataOrder = await appApi.createOrder({
        fromValue: formData.from.amount,
        fromTokenId: formData.from.token._id,
        toValue: formData.to.amount,
        toTokenId: formData.to.token._id,
      });
      
      toast.update(toastify, {
        render: "The order was created successfully.",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });

      dispatch(updateTask({task: {...task, status: 3, orderID: dataOrder.data._id}, id: task.id}))
    } catch (error) {
      console.log(error);
      toast.update(toastify, {
        render: "The order was created fail, see detail in console.",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      dispatch(updateTask({task: {...task, status: -2}, id: task.id}))
    }
    dispatch(doneOneTask())
  }

  const hdClickSelectTokenFrom = () => {
    setSelectingTokenFrom(!selectingTokenFrom);
  };
  const hdClickSelectTokenTo = () => {
    setSelectingTokenTo(!selectingTokenTo);
  };
  return (
    <div className="app-create">

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <div>
          <p className="title">Swap</p>
          <p className="title--desc">Easy way to exchange your loyalty points</p>
        </div>

        <div>
          <Button
            style={isOneChain ? { backgroundColor: "#597ef7" } : {}}
            onClick={() => {setIsOneChain(true); setFormData({...formData, to: {
              token: "",
              amount: 0,
              balance: 0
            }})}}
          > One Chain
          </Button>
          <Button
            style={{ marginLeft: 10, backgroundColor: !isOneChain ? "#9254de" : "white"}}
            onClick={() => {setIsOneChain(false); setFormData({...formData, to: {
              token: "",
              amount: 0,
              balance: 0
            }})}
          }

          > Cross Chain
          </Button>
        </div>
      </div>

      <div className="content">
        <div className="form">
          <div className="form-input">
            <div className="form-input--header">
              <p>From</p>
              {formData.from.token !== "" ? (
                <div className="form-input--header--token"
                  onClick={hdClickSelectTokenFrom}
                >
                  <img src={formData.from.token.image} alt="Token" />
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
                precision={2}
                value={formData.from.amount}
                onChange={(e) =>
                  setFormData({ ...formData, from: {...formData.from, amount: Number(e)}})
                }
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button
                  onClick={() =>
                    setFormData({ ...formData, from: {...formData.from, amount: Number(formData.from.balance)}})
                  }
                >
                  MAX
                </Button>
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
              {formData.to.token !== "" ? (
                <div
                  className="form-input--header--token"
                  onClick={hdClickSelectTokenTo}
                >
                  <img src={formData.to.token.image} alt="Token" />
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
                precision={2}
                value={formData.to.amount}
                onChange={(e) =>
                  setFormData({ ...formData, to: {...formData.to, amount: Number(e)}})
                }
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button
                  onClick={() =>
                  setFormData({ ...formData, to: {...formData.to, amount: Number(formData.to.balance)}})
                  }
                >
                  MAX
                </Button>
                <p>Available: {formData.to.balance}</p>
              </div>
            </div>
          </div>
        </div>

        <Divider type="vertical" className="divider" />

        <div className="info">
          <div className="average">
            <p className="info-title">Average exchange rate</p>
            <div style={{ minHeight: 40 }}>
              {
                <div className="pair">
                  <PairToken
                    from_img={
                      formData.from.token !== "" ? formData.from.token.image : null
                    }
                    to_img={formData.to.token !== "" ? formData.to.token.image : null}
                  />
                  <p className="average">{rate}</p>
                </div>
              }
              <div
                style={{ fontSize: "1.6rem", fontWeight: 500, marginTop: 24 }}
              >
                <p className="info-title">Exchange Rate:</p>
                {
                  <p style={{ width: "100%", textAlign: "center" }}>
                    <InputNumber
                      step={0.1}
                      min={0}
                      precision={3}
                      value={(formData.from.amount === 0 || formData.to.amount === 0) ? undefined : formData.from.amount / formData.to.amount}
                      onChange={(e) => e && setFormData({...formData, to: {...formData.to, amount: Number((formData.from.amount / e).toFixed(2))}})}
                    />
                    <span style={{ marginLeft: "1rem" }}>
                      {formData.from.token !== "" ? formData.from.token.symbol : ""}
                    </span>{" "}
                    {"/"}
                    <span>
                      {formData.to.token !== "" ? formData.to.token.symbol : ""}
                    </span>{" "}
                    {""}
                  </p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <p style={{ fontSize: "1.4rem", color: "orange" }}>
          {
            formData.from.token !== "" && formData.to.token !== "" && Number(rate) !== formData.from.amount / formData.to.amount &&
            <>
              <WarningOutlined rev={""} /> Warning:{" "}
              <span style={{ color: "black" }}>
                Your exchange rate is {Number(rate) < (formData.from.amount / formData.to.amount) ? 'higher' : "lower"} than average.{" "}
              </span>
            </>
          }
        </p>
      </div>
      
      <Button type="primary" onClick={onClickCreate} className="btn-create-order">
        Create
      </Button>

      {selectingTokenFrom && (
        <SelectToken
          closeFunction={hdClickSelectTokenFrom}
          onClickSelect={(token: any) => {
            console.log(token)
            setFormData({ ...formData, from: {...formData.from, token: token.token, balance: token.balance} });
            hdClickSelectTokenFrom();

          }}
          tokenHidden={
            formData.to.token !== "" ? formData.to.token.deployedAddress : ""
          }
          isCheckNetwork={true}
          hiddenChain={(!isOneChain && formData.to.token !== '') ? formData.to.token.network : null}
        />
      )}

      {selectingTokenTo && (
        <SelectToken
          closeFunction={hdClickSelectTokenTo}
          onClickSelect={(token: any) => {
            hdClickSelectTokenTo();
            setFormData({ ...formData, to: {...formData.to, token: token.token, balance: token.balance}});
          }}
          isCheckNetwork={isOneChain ? true : false}
          tokenHidden={
            formData.from.token !== "" ? formData.from.token.deployedAddress : ""
          }
          hiddenOtherNetwork={isOneChain ? true : false}
          hiddenChain={(!isOneChain && formData.from.token !== '') ? formData.from.token.network : null}
        />
      )}
    </div>
  );
}
