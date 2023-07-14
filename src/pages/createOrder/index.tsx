import React, { useState } from "react";
import { DownOutlined, LoadingOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Divider, InputNumber, Modal, Steps } from "antd";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

import "./CreateOrder.scss";
import SBP from "../../assets/svg/tokens/starbuck.svg";
import PairToken from "../../components/app/PairToken";
import SelectToken from "../../components/app/SelectToken";
import { useAppSelector } from "../../state/hooks";
import ExchangeContract from '../../contract/Exchange/data.json'
import appApi from "../../api/appAPI";
import { useAppDispatch } from "../../state/hooks";
import { getBalanceAccount, mappingNetwork } from "../../utils/blockchain";
import { saveInfo } from "../../state/user/userSlice";
import {MBC_EXCHANGE_ADDRESS} from '../../constants/contracts'
import TokenContract from '../../contract/Token/data.json'
import { saveModal } from "../../state/modal/modalSlice";
import { ICreateTask, createTask, updateTask } from "../../state/task/taskSlice";


interface IFormData {
  from: any;
  from_amount: number;
  to: any;
  to_amount: number;
  timelock: number;
}

export default function CreateOrder() {
  const web3State = useAppSelector((state) => state.appState.web3)
  const tokenState = useAppSelector((state) => state.appState.tokens)
  const userState = useAppSelector((state) => state.userState)
  const taskState = useAppSelector((state) => state.taskState)
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<IFormData>({
    from: '',
    from_amount: 0,
    to: '',
    to_amount: 10,
    timelock: 0,
  });
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectingTokenFrom, setSelectingTokenFrom] = useState<boolean>(false);
  const [selectingTokenTo, setSelectingTokenTo] = useState<boolean>(false);
  const [idTask, setIdTask] = useState(-1);


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
    if (formData.from.token.deployedAddress === formData.to.token.deployedAddress) {
      alert("Please select different token");
      return;
    }
    if (formData.from.token.symbol === formData.to.token.symbol) {
      alert("Please select different token");
      return;
    }
    setOpenModal(true)
  }



  const onConfirmCreate = async () => {
    const orderId = uuidv4();
    
    const transferTask : ICreateTask = {
      id: taskState.taskList.length,
      type: "CREATE",
      status: 1,
      tokenFrom: formData.from.token,
      tokenTo: formData.to.token,
      amountFrom: formData.from_amount,
      amountTo: formData.to_amount,
    }

    try {
      const id = toast.loading("Approving token...")
      
      const exchangeContract = new web3State.eth.Contract(ExchangeContract.abi, MBC_EXCHANGE_ADDRESS);
      const tokenContract = new web3State.eth.Contract(TokenContract.abi, formData.from.token.deployedAddress)
      
      dispatch(createTask(transferTask))
      setIdTask(transferTask.id)
      
      const approveRecipt = await tokenContract.methods.approve(
        MBC_EXCHANGE_ADDRESS,
        BigInt(10 ** Number(18) * Number(formData.from_amount)),
      ).send({from: userState.address})
      toast.update(id, { render: "Successfully approve token", type: "success", isLoading: false, autoClose: 500});
      
      dispatch(updateTask({
        task: {
            ...transferTask, 
            status: 2,
        }, 
        id: transferTask.id
    }))
      
      
      const createExchangeMethod = exchangeContract.methods.createTx(
        orderId, 
        formData.from.token.deployedAddress,
        formData.to.token.deployedAddress,
        BigInt(10 ** Number(18) * Number(formData.from_amount)),
        BigInt(10 ** Number(18) * Number(formData.to_amount)),
        BigInt(24),
      )
      toast.update(id, { render: "Sending token...", type: "default", isLoading: true});

      const reciptExchange = await web3State.eth.sendTransaction({
        from: userState.address,
        gasPrice: "0",
        gas: await createExchangeMethod.estimateGas({
          from: userState.address,
          data: createExchangeMethod.encodeABI()
        }) ,
        to: MBC_EXCHANGE_ADDRESS,
        value: "0",
        data: createExchangeMethod.encodeABI(),
      })
      
      const orderData = await appApi.createOrder( {
        fromValue: formData.from_amount,
        fromTokenId: formData.from.token._id,
        toValue: formData.to_amount,
        toTokenId: formData.to.token._id,
        timelock: 24,
        hashlock: 'LoyalChain',
        txIdFrom: orderId
      })
    
      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(web3State, userState, tokenState) }))
      
      toast.update(id, { render: "The order was created successfully.", type: "success", isLoading: false, autoClose: 1000});
 
      dispatch(updateTask({
        task: {
            ...transferTask, 
            status: 3,
            transactionHash: reciptExchange.transactionHash,
            orderID: orderData && orderData.data._id
        }, 
        id: transferTask.id
      }))

      // dispatch(saveModal({
      //   open: true,
      //   titleModal: "Notification",
      //   status: "success",
      //   title: "Successfully Upload Order to Marketplace",
      //   subtitle: `Order ID: ${orderData ? orderData.data._id : ""}`,
      //   content:                     
      //   <>
      //     <p>Swap: {formData.from_amount}{formData.from.token.symbol} for {formData.to_amount}{formData.to.token.symbol}</p>
      //     <p>Transaction hash: {reciptExchange.blockHash}</p>
      //     <p>Time created: {orderData ? orderData.data.createdAt : ''}</p>
      //   </>
      // }))

    } catch (error) {
      alert(error)
      dispatch(updateTask({
        task: {
            ...transferTask, 
            status: -1,
        }, 
        id: getTask(idTask).status === 1 ? -1 : -2 
      }))
    }
  };

  const hdClickSelectTokenFrom = () => {
    setSelectingTokenFrom(!selectingTokenFrom);
  };

  const hdClickSelectTokenTo = () => {
    setSelectingTokenTo(!selectingTokenTo);
  };


  const getTask : any = (id: number) => {
    return taskState.taskList[taskState.taskList.length - 1 - id]
  }

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
        onClick={onClickCreate}
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
          isCheckNetwork={true}
        />
      )}

      {selectingTokenTo && (
        <SelectToken closeFunction={hdClickSelectTokenTo} 
          onClickSelect={(token: any) => {
            hdClickSelectTokenTo()
            setFormData({...formData, to: token})
          }}
          isCheckNetwork={true}
        />
      )}

      {
        openModal &&
      <Modal
          title="Create Order"
          open={openModal}
          
          onOk={idTask === -1 ? onConfirmCreate : () => {setOpenModal(false) ; setIdTask(-1)}}
          okText= {idTask === -1 ? "Confirm" : 'OK'}

          cancelText="Cancel"
          onCancel={() => {setOpenModal(false); setIdTask(-1)}}

          width={700}
          style={{top: 200}}
          
          closable={true}
      >

          <Steps
              size="default"
              style={{width: 600, margin: 'auto', marginTop: 40, marginBottom: 30}}
              items={
                idTask === -1 ? 
                [
                  {
                    title: "Approve Token",
                    status: "wait"
                  },
                  {
                    title: "Send Token",
                    status: "wait"
                  },
                  {
                    title: "Done",
                    status: "wait"
                  }
                ] : 
                [
                  {
                    title: "Approve Token",
                    status: getTask(idTask).status === -1 ? 'error' : 
                            ((getTask(idTask).status >  1) ? 'finish' : 'process'),
                    icon:  getTask(idTask).status === 1 && <LoadingOutlined  rev={""}/>
                  },
                  {
                    title: "Send Token",
                    status: getTask(idTask).status === -2 ? 'error' : (
                              getTask(idTask).status < 2 ? 'wait' : (
                                getTask(idTask).status === 3 ? 'finish' : 'process'
                              )
                            ),
                    icon:  getTask(idTask).status === 2 && <LoadingOutlined  rev={""}/>                  
                  },
                  {
                    title: 'Done',
                    status: getTask(idTask).status === 3 ? 'finish' : 'wait'
                  }
                ]}
          />
          
           <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 30}}>
              <div >
                <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{formData.from.token.name}</p>
                <p style={{textAlign: "right", fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{formData.from_amount} {formData.from.token.symbol}</p>
              </div>
              <PairToken from_img={formData.from.token.image} to_img={formData.to.token.image} width={60}/>
              <div>
                  <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{formData.to.token.name}</p>
                  <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{formData.to_amount} {formData.to.token.symbol}</p>
              </div>
          </div>
          
          
          <div style={{fontWeight: 500}}>
              <p>Status: {
                  idTask === -1  ? 
                      <span style={{fontWeight: 400, color: "#333"}}>Pending</span> 
                  : (getTask(idTask).status === 3 ? 
                      <span style={{fontWeight: 400, color: "#52c41a"}}>Success</span> 
                  : 
                      <span style={{fontWeight: 400, color: '#1677ff'}}>In Progress</span>)}
              </p>
              
              <p>Network: 
                  <span style={{fontWeight: 400}}> {
                    formData.from.token.network === formData.to.token.network ?
                      mappingNetwork(formData.from.token.network)
                    : mappingNetwork(formData.from.token.network) + ' - ' + mappingNetwork(formData.to.token.network)  
                  }
                  </span>
              </p>
              <p>Transaction Hash:  
                  <span style={{fontWeight: 400}}> {
                      idTask === -1 ? '...' :
                      (getTask(idTask).status === 3 ? getTask(idTask).transactionHash : '...')
                  }</span>
              </p>
              <p>Order ID:  
                  <span style={{fontWeight: 400}}> {
                      idTask === -1 ? '...' :
                      (getTask(idTask).status === 3 ? getTask(idTask).orderID : '...')
                  }</span>
              </p>
          </div>
       
      </Modal>
      }
      </div>
  );
}
