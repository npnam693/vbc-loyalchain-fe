import { DownOutlined, LoadingOutlined, SwapOutlined, WarningOutlined,} from "@ant-design/icons";
import { Button, Divider, InputNumber, Modal, Steps } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import "./CreateOrder.scss";
import appApi from "../../../api/appAPI";
import { saveInfo } from "../../../state/user/userSlice";
import PairToken from "../../../components/app/PairToken";
import SelectToken from "../../../components/app/SelectToken";
// import { MBC_EXCHANGE_ADDRESS } from "../../constants/contracts";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { getBalanceAccount, getBalanceToken, mappingNetwork } from "../../../utils/blockchain";
import { ICreateTask, createTask, updateTask,} from "../../../state/task/taskSlice";
import { getTokenContract, getSwapOneContract } from "../../../services/contract";
import { getAddressOneChainContract } from "../../../utils/blockchain";

interface IFormData {
  from: any;
  from_amount: number;
  to: any;
  to_amount: number;
  timelock: number;
}

export default function CreateOrder() {
  const web3State = useAppSelector((state) => state.appState.web3);
  const tokenState = useAppSelector((state) => state.appState.tokens);
  const userState = useAppSelector((state) => state.userState);
  const taskState = useAppSelector((state) => state.taskState);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<IFormData>({
    from: "",
    from_amount: 0,
    to: "",
    to_amount: 0,
    timelock: 24,
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectingTokenFrom, setSelectingTokenFrom] = useState<boolean>(false);
  const [selectingTokenTo, setSelectingTokenTo] = useState<boolean>(false);
  const [idTask, setIdTask] = useState(-1);
  const [isOneChain, setIsOneChain] = useState<boolean>(true);
  const [rate, setRate] = useState("0.000");
  const hdClickSwap = () => {
    const newData: IFormData = {
      from: formData.to,
      from_amount: formData.to_amount,
      to: formData.from,
      to_amount: formData.from_amount,
      timelock: formData.timelock,
    };
    setFormData(newData);
    countExchangeRateForm();
  };
  const countExchangeRateForm = async () => {
    const res = await appApi.getExchangeRate({
      tokenId1: formData.from.token._id,
      tokenId2: formData.to.token._id,
    });
    setRate(String(res?.data));
  };
  const onClickCreate = async () => {
    if (formData.from === "" || formData.to === "") {
      alert("Please select token");
      return;
    }
    if (formData.from_amount <= 0) {
      alert("Please input amount");
      return;
    }
    if (formData.from_amount > formData.from.balance) {
      alert("Insufficient balance");
      return;
    }
    if (
      formData.from.token.deployedAddress === formData.to.token.deployedAddress
    ) {
      alert("Please select different token");
      return;
    }
    if (formData.from.token.symbol === formData.to.token.symbol) {
      alert("Please select different token");
      return;
    }
    setOpenModal(true);
  };
  const hdClickSelectTokenFrom = () => {
    setSelectingTokenFrom(!selectingTokenFrom);
  };

  const hdClickSelectTokenTo = () => {
    setSelectingTokenTo(!selectingTokenTo);
  };
  const getTask: any = (id: number) => {
    return taskState.taskList[taskState.taskList.length - 1 - id];
  };




  const createOrderOneChain = async () => {
    const orderId = uuidv4();
    let myTask: ICreateTask = {
      id: taskState.taskList.length,
      type: "CREATE",
      status: 1,
      tokenFrom: formData.from.token,
      tokenTo: formData.to.token,
      amountFrom: formData.from_amount,
      amountTo: formData.to_amount,
    };
    const toastify = toast.loading("Approving token...");
    dispatch(createTask(myTask));
    setIdTask(myTask.id);
    try {
      const exchangeContract = getSwapOneContract(web3State, userState.network)
      const tokenContract = getTokenContract(web3State, formData.from.token.deployedAddress)
      const SWAP_CONTRACT_ADDRESS = getAddressOneChainContract(userState.network)

      const approveRecipt = await tokenContract.methods
        .approve(
          SWAP_CONTRACT_ADDRESS,
          BigInt(10 ** Number(18) * Number(formData.from_amount))
        )
        .send({ from: userState.address });
      toast.update(toastify, {
        render: "Successfully approve token",
        type: "success",
        isLoading: false,
        autoClose: 500,
      });
      myTask = {...myTask, status: 2}
      dispatch(updateTask({
        task: myTask,
        id: myTask.id,
      }))


      const createExchangeMethod = exchangeContract.methods.createTx(
        orderId,
        formData.from.token.deployedAddress,
        formData.to.token.deployedAddress,
        BigInt(10 ** Number(18) * Number(formData.from_amount)),
        BigInt(10 ** Number(18) * Number(formData.to_amount)),
        BigInt(24)
      )

      toast.update(toastify, {
        render: "Sending token...",
        type: "default",
        isLoading: true,
      });

      const reciptExchange = await web3State.eth.sendTransaction({
        from: userState.address,
        gasPrice: "0",
        gas: await createExchangeMethod.estimateGas({
          from: userState.address,
          data: createExchangeMethod.encodeABI(),
        }),
        to: SWAP_CONTRACT_ADDRESS,
        value: "0",
        data: createExchangeMethod.encodeABI(),
      });
      const orderData = await appApi.createOrder({
        fromValue: formData.from_amount,
        fromTokenId: formData.from.token._id,
        toValue: formData.to_amount,
        toTokenId: formData.to.token._id,
        timelock: 24,
        txId: orderId,
      });

      dispatch(saveInfo({
        ...userState,
        wallet: await getBalanceAccount(web3State, userState, tokenState),
      }))
      toast.update(toastify, {
        render: "The order was created successfully.",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });

      myTask = {...myTask,           
        status: 3,
        transactionHash: reciptExchange.transactionHash,
        orderID: orderData && orderData.data._id,}

      dispatch( updateTask({
        task: myTask,
        id: myTask.id,
      }))
    } catch (error) {
      console.log(myTask, myTask.id)
      console.log(error);
      toast.update(toastify, {
        render: "The order was created fail, see detail in console.",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      
      dispatch(updateTask({
        task: {
          ...myTask,
          status: myTask.status === 1 ? -1 : -2,
        },
        id: myTask.id,
      }));
    }
  };
  const createOrderTwoChain = async () => {
    const orderId = uuidv4();
    const transferTask: ICreateTask = {
      id: taskState.taskList.length,
      type: "CREATE",
      status: 1,
      tokenFrom: formData.from.token,
      tokenTo: formData.to.token,
      amountFrom: formData.from_amount,
      amountTo: formData.to_amount,
    };
    
    const toastify = toast.loading("Check your balance...");
    dispatch(createTask(transferTask));
    
    try {
      setIdTask(transferTask.id);
      const balance = await getBalanceToken(web3State, userState, formData.from.token)
      if (Number(balance) < Number(formData.from_amount)) {
        toast.update(toastify, {
          render: "Insufficient balance",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
        
        dispatch(updateTask({
          task: {
            ...transferTask,
            status: -1,
          },
          id: transferTask.id,
        }))

        return;
      }

      dispatch(updateTask({
        task: {
          ...transferTask,
          status: 2,
        },
        id: transferTask.id,
      }))

      toast.update(toastify, {
        render: "Save order...",
        type: "default",
        isLoading: true,
      });

      const orderData = await appApi.createOrder({
        fromValue: formData.from_amount,
        fromTokenId: formData.from.token._id,
        toValue: formData.to_amount,
        toTokenId: formData.to.token._id,
        timelock: formData.timelock,
        txId: orderId,
      });
      
      toast.update(toastify, {
        render: "The order was created successfully.",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });

      dispatch(updateTask({
        task: {
          ...transferTask,
          status: 3,
        },
        id: transferTask.id,
      }))
    
    } catch (error) {
      console.log(error);
      toast.update(toastify, {
        render: "The order was created fail, see detail in console.",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      dispatch(updateTask({
        task: {
          ...transferTask,
          status: -2,
        },
        id: transferTask.id,
      }));
    }
  }

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
            onClick={() => setIsOneChain(true)}
          > One Chain
          </Button>
          <Button
            style={{ marginLeft: 10, backgroundColor: !isOneChain ? "#9254de" : "white"}}
            onClick={() => setIsOneChain(false)}
          > Cross Chain
          </Button>
        </div>
      </div>

      <div className="content">
        <div className="form">
          <div className="form-input">
            <div className="form-input--header">
              <p>From</p>
              {formData.from !== "" ? (
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
                value={formData.from_amount}
                onChange={(e) =>
                  setFormData({ ...formData, from_amount: Number(e) })
                }
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      from_amount: Number(formData.from.balance),
                    })
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
              {formData.to !== "" ? (
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
                value={formData.to_amount}
                onChange={(e) =>
                  setFormData({ ...formData, to_amount: Number(e) })
                }
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      to_amount: Number(formData.to.balance),
                    })
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
                      formData.from !== "" ? formData.from.token.image : null
                    }
                    to_img={formData.to !== "" ? formData.to.token.image : null}
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
                      value={formData.from_amount / formData.to_amount}
                      onChange={(e) => e && setFormData({...formData,
                        to_amount: Number((formData.from_amount / e).toFixed(2)),
                      })}
                    />
                    <span style={{ marginLeft: "1rem" }}>
                      {formData.from !== "" ? formData.from.token.symbol : ""}
                    </span>{" "}
                    {"/"}
                    <span>
                      {formData.to !== "" ? formData.to.token.symbol : ""}
                    </span>{" "}
                    {""}
                  </p>
                }
              </div>
            </div>
          </div>

          {!isOneChain && (
            <div className="locktime">
              <p className="info-title">Time Lock</p>
              <div className="input-time">
                <InputNumber min={0} value={24} />
                <p>hours</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <p style={{ fontSize: "1.4rem", color: "orange" }}>
          <WarningOutlined rev={""} /> Warning:{" "}
          <span style={{ color: "black" }}>
            Your exchange rate is higer than average.{" "}
          </span>
        </p>
      </div>
      
      <Button type="primary" onClick={onClickCreate} className="btn-create-order">
        Create
      </Button>

      {selectingTokenFrom && (
        <SelectToken
          closeFunction={hdClickSelectTokenFrom}
          onClickSelect={(token: any) => {
            setFormData({ ...formData, from: token });
            hdClickSelectTokenFrom();
            if (formData.to !== "") {
              countExchangeRateForm();
            }
          }}
          tokenHidden={
            formData.to !== "" ? formData.to.token.deployedAddress : ""
          }
          isCheckNetwork={true}
          hiddenChain={(!isOneChain && formData.to !== '') ? formData.to.token.network : null}
        />
      )}

      {selectingTokenTo && (
        <SelectToken
          closeFunction={hdClickSelectTokenTo}
          onClickSelect={(token: any) => {
            hdClickSelectTokenTo();
            setFormData({ ...formData, to: token });
            if (formData.from !== "") {
              countExchangeRateForm();
            }
          }}
          isCheckNetwork={isOneChain ? true : false}
          tokenHidden={
            formData.from !== "" ? formData.from.token.deployedAddress : ""
          }
          hiddenOtherNetwork={isOneChain ? true : false}
          hiddenChain={(!isOneChain && formData.from !== '') ? formData.from.token.network : null}
        />
      )}

      {openModal && isOneChain && (
        <Modal
          title="Create Order"
          open={openModal}
          onOk={
            idTask === -1
              ? createOrderOneChain
              : () => {
                  setOpenModal(false);
                  setIdTask(-1);
                }
          }
          okText={idTask === -1 ? "Confirm" : "OK"}
          cancelText="Cancel"
          onCancel={() => {
            setOpenModal(false);
            setIdTask(-1);
          }}
          width={700}
          style={{ top: 200 }}
          closable={true}
        >
          <Steps
            size="default"
            style={{
              width: 600,
              margin: "auto",
              marginTop: 40,
              marginBottom: 30,
            }}
            items=
            {
              idTask === -1 ? 
              [
                {
                  title: "Approve Token",
                  status: "wait",
                },
                {
                  title: "Send Token",
                  status: "wait",
                },
                {
                  title: "Done",
                  status: "wait",
                },
              ]
              : [
                  {
                    title: "Approve Token",
                    status:
                      getTask(idTask).status === -1
                        ? "error"
                        : getTask(idTask).status > 1
                        ? "finish"
                        : "process",
                    icon: getTask(idTask).status === 1 && (
                      <LoadingOutlined rev={""} />
                    ),
                  },
                  {
                    title: "Send Token",
                    status:
                      getTask(idTask).status === -2
                        ? "error"
                        : getTask(idTask).status < 2
                        ? "wait"
                        : getTask(idTask).status === 3
                        ? "finish"
                        : "process",
                    icon: getTask(idTask).status === 2 && (
                      <LoadingOutlined rev={""} />
                    ),
                  },
                  {
                    title: "Done",
                    status: getTask(idTask).status === 3 ? "finish" : "wait",
                  },
                ]
            }
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  lineHeight: "1.6rem",
                }}
              >
                {formData.from.token.name}
              </p>
              <p
                style={{
                  textAlign: "right",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                }}
              >
                {formData.from_amount} {formData.from.token.symbol}
              </p>
            </div>
            <PairToken
              from_img={formData.from.token.image}
              to_img={formData.to.token.image}
              width={60}
            />
            <div>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  lineHeight: "1.6rem",
                }}
              >
                {formData.to.token.name}
              </p>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                }}
              >
                {formData.to_amount} {formData.to.token.symbol}
              </p>
            </div>
          </div>

          <div style={{ fontWeight: 500 }}>
            <p>
              Status:{" "}
              {idTask === -1 ? (
                <span style={{ fontWeight: 400, color: "#333" }}>Pending</span>
              ) : getTask(idTask).status === 3 ? (
                <span style={{ fontWeight: 400, color: "#52c41a" }}>
                  Success
                </span>
              ) : (
                <span style={{ fontWeight: 400, color: "#1677ff" }}>
                  In Progress
                </span>
              )}
            </p>

            <p>
              Network:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {formData.from.token.network === formData.to.token.network
                  ? mappingNetwork(formData.from.token.network)
                  : mappingNetwork(formData.from.token.network) +
                    " - " +
                    mappingNetwork(formData.to.token.network)}
              </span>
            </p>
            <p>
              Transaction Hash:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {idTask === -1
                  ? "..."
                  : getTask(idTask).status === 3
                  ? getTask(idTask).transactionHash
                  : "..."}
              </span>
            </p>
            <p>
              Order ID:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {idTask === -1
                  ? "..."
                  : getTask(idTask).status === 3
                  ? getTask(idTask).orderID
                  : "..."}
              </span>
            </p>
          </div>
        </Modal>
      )}
      {openModal && !isOneChain && (
        <Modal
          title="Create Order"
          open={openModal}
          onOk={
            idTask === -1
              ? createOrderTwoChain
              : () => {
                  setOpenModal(false);
                  setIdTask(-1);
                }
          }
          okText={idTask === -1 ? "Confirm" : "OK"}
          cancelText="Cancel"
          onCancel={() => {
            setOpenModal(false);
            setIdTask(-1);
          }}
          width={700}
          style={{ top: 200 }}
          closable={true}
        >
          <Steps
            size="default"
            style={{
              width: 600,
              margin: "auto",
              marginTop: 40,
              marginBottom: 30,
            }}
            items=
            {
              idTask === -1 ? 
              [
                {
                  title: "Check balance",
                  status: "wait",
                },
                {
                  title: "Save Order",
                  status: "wait",
                },
                {
                  title: "Done",
                  status: "wait",
                },
              ]
              : [
                  {
                    title: "Check balance",
                    status:
                      getTask(idTask).status === -1
                        ? "error"
                        : getTask(idTask).status > 1
                        ? "finish"
                        : "process",
                    icon: getTask(idTask).status === 1 && (
                      <LoadingOutlined rev={""} />
                    ),
                  },
                  {
                    title: "Save Order",
                    status:
                      getTask(idTask).status === -2
                        ? "error"
                        : getTask(idTask).status < 2
                        ? "wait"
                        : getTask(idTask).status === 3
                        ? "finish"
                        : "process",
                    icon: getTask(idTask).status === 2 && (
                      <LoadingOutlined rev={""} />
                    ),
                  },
                  {
                    title: "Done",
                    status: getTask(idTask).status === 3 ? "finish" : "wait",
                  },
                ]
            }
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  lineHeight: "1.6rem",
                }}
              >
                {formData.from.token.name}
              </p>
              <p
                style={{
                  textAlign: "right",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                }}
              >
                {formData.from_amount} {formData.from.token.symbol}
              </p>
            </div>
            <PairToken
              from_img={formData.from.token.image}
              to_img={formData.to.token.image}
              width={60}
            />
            <div>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  lineHeight: "1.6rem",
                }}
              >
                {formData.to.token.name}
              </p>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                }}
              >
                {formData.to_amount} {formData.to.token.symbol}
              </p>
            </div>
          </div>

          <div style={{ fontWeight: 500 }}>
            <p>
              Status:{" "}
              {idTask === -1 ? (
                <span style={{ fontWeight: 400, color: "#333" }}>Pending</span>
              ) : getTask(idTask).status === 3 ? (
                <span style={{ fontWeight: 400, color: "#52c41a" }}>
                  Success
                </span>
              ) : (
                <span style={{ fontWeight: 400, color: "#1677ff" }}>
                  In Progress
                </span>
              )}
            </p>

            <p>
              Network:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {formData.from.token.network === formData.to.token.network
                  ? mappingNetwork(formData.from.token.network)
                  : mappingNetwork(formData.from.token.network) +
                    " - " +
                    mappingNetwork(formData.to.token.network)}
              </span>
            </p>
            <p>
              Transaction Hash:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {idTask === -1
                  ? "..."
                  : getTask(idTask).status === 3
                  ? getTask(idTask).transactionHash
                  : "..."}
              </span>
            </p>
            <p>
              Order ID:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {idTask === -1
                  ? "..."
                  : getTask(idTask).status === 3
                  ? getTask(idTask).orderID
                  : "..."}
              </span>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
