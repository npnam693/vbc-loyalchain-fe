import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
import { Divider, Modal, Steps } from "antd";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

import "./MyOrderItem.scss";
import appApi from "../../../api/appAPI";
import PairToken from "../../app/PairToken";
import { useAppSelector } from "../../../state/hooks";
import { useAppDispatch } from "../../../state/hooks";
import { saveInfo } from "../../../state/user/userSlice";
import { IAcceptTask, createTask, updateTask } from "../../../state/task/taskSlice";
import { getSwapOneContract, getTokenContract, getSwapTwoConract } from "../../../services/contract";
import { getAddressOneChainContract, getAddressTwoChainContract, getBalanceAccount, mappingNetwork } from "../../../utils/blockchain";
import { requestChangeNetwork } from "../../../services/metamask";
import Countdown from "antd/es/statistic/Countdown";


interface IMyOrderItem {
  data: any
  isPendingOrder?: boolean;
}



const MyOrderItem = ({data, isPendingOrder} : IMyOrderItem) => {
  const dispatch = useAppDispatch()
  const { appState, userState, taskState } = useAppSelector((state) => state)
  const [dataOrder, setDataOrder] = useState<any>(userState.address === data.from.address ? data : {...data, fromValue: data.toValue, toValue: data.fromValue});
  useEffect(() =>     
    userState.address === data.from.address ? setDataOrder(data) : 
      setDataOrder({...data, fromValue: data.toValue, toValue: data.fromValue})
  , [userState.address])
  
  const [idTask, setIdTask] = useState(-1);
  // -1:Hidden - 1: Remove Modal  - 2. Detail modal 
  const [openModal, setOpenModal] = useState<number>(-1);
  const getTask : any = (id : number) => {
    return taskState.taskList[taskState.taskList.length - 1 - id]
  }
  
  const sellerDeposit = async () => {
    if (data.fromValue.token.network !== userState.network) {
      requestChangeNetwork(data.fromValue.token.network)
      return
    }

    let depositTask : IAcceptTask = {
      id: taskState.taskList.length,
      type: "SELLER_DEPOSIT",
      status: 1,
      tokenFrom: data.fromValue.token,
      tokenTo: data.toValue.token,
      amountFrom: data.fromValue.amount,
      amountTo: data.toValue.amount,
      orderID: data._id,
      owner: data.from.address
    }

    const toaster = toast.loading("Approving token...")
    dispatch(createTask(depositTask))
    setIdTask(depositTask.id)
    
    try {
      const exchangeContract = getSwapTwoConract(appState.web3, userState.network);
      const tokenContract = getTokenContract(appState.web3, dataOrder.fromValue.token.deployedAddress)
      const SWAP_ADDRESS_CONTRACT = getAddressTwoChainContract(userState.network)
      
      const approveRecipt = await tokenContract.methods.approve(
        SWAP_ADDRESS_CONTRACT,
        BigInt(10 ** Number(18) * Number(data.fromValue.amount)),
      ).send({from: userState.address})
      

      depositTask = {...depositTask, status: 2}
      dispatch(updateTask({
        task: depositTask, 
        id: depositTask.id
      }))
      toast.update(toaster, { render: "Deposit token...", type: "default", isLoading: true});
      
      const depositMethod = exchangeContract.methods.create(
        data.txId,
        data.to.address,
        data.fromValue.token.deployedAddress,
        BigInt(10 ** Number(18) * Number(data.fromValue.amount)),
        "vcl that",
        appState.web3.utils.soliditySha3('vcl that'),
        BigInt(24)
      )

      const acceptRecepit = await appState.web3.eth.sendTransaction({
        from: userState.address,
        gasPrice: "0",
        gas: await depositMethod.estimateGas({
          from: userState.address,
          data: depositMethod.encodeABI()
        }),
        to: SWAP_ADDRESS_CONTRACT,
        value: "0",
        data: depositMethod.encodeABI(),
      })

      const orderData = await appApi.updateStatusOrder(data._id, "sender accepted")
      
      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
      
      toast.update(toaster, { render: "Deposit token successfully.", type: "success", isLoading: false, autoClose: 1000});
      
      depositTask = {...depositTask, status: 3, transactionHash: acceptRecepit.blockHash}
      dispatch(updateTask({
        task: depositTask, 
        id: depositTask.id
      }))

    } catch (error) {
      console.log(error);
      dispatch(updateTask({
        task: {
            ...depositTask, 
            status: depositTask.status === 1 ? -1 : -2 ,
        }, 
        id: depositTask.id
      }))
      toast.update(toaster, { render: "Accept order fail, see detail in console!", type: "error", isLoading: false, autoClose: 1000});
    }
  }


  const removeOrder1Chain = async () => {
    if (data.fromValue.token.network !== userState.network) {
      requestChangeNetwork(data.fromValue.token.network);
      return;
    }
    const toaster = toast.loading("Remove Order..")
    let cancelTask : IAcceptTask = {
      id: taskState.taskList.length,
      type: "ONECHAIN-CANCEL",
      status: 1,
      tokenFrom: data.fromValue.token,
      tokenTo: data.toValue.token,
      amountFrom: data.fromValue.amount,
      amountTo: data.toValue.amount,
      orderID: data._id,
      owner: data.from.address
    }
    dispatch(createTask(cancelTask))
    setIdTask(cancelTask.id)
    try {
      const exchangeContract = getSwapOneContract(appState.web3, userState.network);
      const SWAP_ADDRESS_CONTRACT = getAddressOneChainContract(userState.network)
      
      const refundMethod = exchangeContract.methods.refund(
        data.txIdFrom,
      )
      const refundRecepit = await appState.web3.eth.sendTransaction({
        from: userState.address,
        gasPrice: "0",
        gas: await refundMethod.estimateGas({
          from: userState.address,
          data: refundMethod.encodeABI()
        }),
        to: SWAP_ADDRESS_CONTRACT,
        value: "0",
        data: refundMethod.encodeABI(),
      })
      
      cancelTask = {...cancelTask, status: 2, transactionHash: refundRecepit.blockHash}
      dispatch(updateTask({
        task: cancelTask, 
        id: cancelTask.id
      }))
      
      await appApi.cancelOrder(data._id)
      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
      cancelTask = {...cancelTask, status: 3}
      dispatch(updateTask({
        task: cancelTask, 
        id: cancelTask.id
      }))
      toast.update(toaster, { render: "The order was removed successfully.", type: "success", isLoading: false, autoClose: 1000});
    } catch (error) {
      dispatch(updateTask({
        task: {
            ...cancelTask, 
            status: cancelTask.status === 1 ? -1 : -2 ,
        }, 
        id: cancelTask.id
      }))
      toast.update(toaster, { render: "Remove order fail.", type: "error", isLoading: false, autoClose: 1000});
    }
  }

  const removeOrder2Chain = async () => {
    const toaster = toast.loading("Remove Order..")
    let cancelTask : IAcceptTask = {
      id: taskState.taskList.length,
      type: "TWOCHAIN-CANCEL",
      status: 1,
      tokenFrom: data.fromValue.token,
      tokenTo: data.toValue.token,
      amountFrom: data.fromValue.amount,
      amountTo: data.toValue.amount,
      orderID: data._id,
      owner: data.from.address
    }
    dispatch(createTask(cancelTask))
    setIdTask(cancelTask.id)
    try {
      await appApi.cancelOrder(data._id)
      cancelTask = {...cancelTask, status: 3}
      dispatch(updateTask({
        task: cancelTask, 
        id: cancelTask.id
      }))
      toast.update(toaster, { render: "The order was removed successfully.", type: "success", isLoading: false, autoClose: 1000});
    } catch (error) {
      console.log(error)
      toast.update(toaster, { render: "Remove order fail.", type: "error", isLoading: false, autoClose: 1000});
      dispatch(updateTask({
        task: {
            ...cancelTask, 
            status: cancelTask.status === 1 ? -1 : -2 ,
        }, 
        id: cancelTask.id
      }))
    }
  }

  const buyerWithdraw = async () => {

  }
  const sellerWithdraw = async () => {}


  const onOkModal = () => {
    if (data.fromValue.token.network === data.toValue.token.network) {
      if (idTask === -1) {
        removeOrder1Chain()
      } else {
        setOpenModal(-1) ; setIdTask(-1)
      }
    } else {
      if (idTask === -1) {
        removeOrder2Chain()
      } else {
        setOpenModal(-1) ; setIdTask(-1)
      }
    }
  }

  return (
    <div className="app-order" style={{marginBottom: 20}}>
      <div className="app-order--info">
        <div className="app-order--info--token">
          <img src={dataOrder.fromValue.token.image} alt="Token" width={60} />
          <div>
            <p className="quantity">{dataOrder.fromValue.amount} <span className="symbol">{dataOrder.fromValue.token.symbol}</span></p>
          </div>
        </div>
        <div className="icon-container">
          <SwapOutlined rev={""} className="icon" />
        </div>
        <div className="app-order--info--token">
          <img src={dataOrder.toValue.token.image} alt="StarBuck" width={60} />
          <div>
            <p className="quantity">{dataOrder.toValue.amount} <span className="symbol">{dataOrder.toValue.token.symbol}</span></p>
            
          </div>
        </div>
      </div>

      <div style={{fontSize: '1.2rem', color:'rgba(255,255,255,0.8)', fontWeight: 500}}>
        <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
          {
            isPendingOrder ? 
            <>
              <p>ID: <span>#{dataOrder._id.slice(0,4)}...{dataOrder._id.slice(-5)}</span></p>
              <p>Exchange rate: {(dataOrder.fromValue.amount/dataOrder.toValue.amount).toFixed(2)}</p>
            </>
            :
            <>
              <div>
                <p>ID: <span>#{dataOrder._id.slice(0,4)}...{dataOrder._id.slice(-5)}</span></p>
                <p>Exchange rate: {(dataOrder.fromValue.amount/dataOrder.toValue.amount).toFixed(2)}</p>
              </div>
              <div className="app-order--action--time_left">
                {/* <p> 3h 4p 50s
                <span style={{fontWeight: 400}}> left</span>
                </p> */}
                  <Countdown value={ Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30} valueStyle={{fontSize: '1.4rem', fontWeight:700, color:'#ccc'}}/>
              </div>
            </>
          }
        </div>
      </div>


      <Divider style={{ marginTop: 6 , marginBottom: 6, borderColor: '#333' }} />
      
      <div className="app-order--action">
          {
            <div className="app-order--action--network">
              <p style={{ color: dataOrder.fromValue.token.network === dataOrder.toValue.token.network ? '#597ef7' : '#9254de' }}>{
                dataOrder.fromValue.token.network === dataOrder.toValue.token.network ?
                mappingNetwork(dataOrder.toValue.token.network) : 
                mappingNetwork(dataOrder.toValue.token.network)?.slice(0, Number(mappingNetwork(dataOrder.toValue.token.network)?.length) -  8) + " - " + mappingNetwork(dataOrder.fromValue.token.network)
              }</p>
            </div>
          }
          <div className="app-order--action--btn" onClick={() => {isPendingOrder ? setOpenModal(1) : setOpenModal(2)}}>
            {
              isPendingOrder ? "Remove" : "Detail"
            }
          </div>
      </div>

      <Modal
          title="Remove Order"
          open={openModal === 1}
          
          onOk={onOkModal}
          okText= {idTask === -1 ? "Confirm" : 'OK'}

          cancelText="Cancel"
          onCancel={() => {setOpenModal(-1); setIdTask(-1)}}

          width={700}
          style={{top: 200}}
          
          closable={true}
      >
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 30}}>
          <div >
            <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{dataOrder.fromValue.token.name}</p>
            <p style={{textAlign: "right", fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{dataOrder.fromValue.amount} {dataOrder.fromValue.token.symbol}</p>
          </div>
          <PairToken from_img={dataOrder.toValue.token.image} to_img={dataOrder.fromValue.token.image} width={60}/>
          <div>
              <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{dataOrder.toValue.token.name}</p>
              <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{dataOrder.toValue.amount} {dataOrder.toValue.token.symbol}</p>
          </div>
        </div>

          {
            dataOrder.toValue.token.network === dataOrder.fromValue.token.network ?
            <Steps size="default" style={{width: 600, margin: 'auto', marginTop: 40, marginBottom: 30}}
              items={
                idTask === -1 ? 
                [
                  {
                    title: "Widthdraw Token",
                    status: "wait"
                  },
                  {
                    title: "Save Data",
                    status: "wait"
                  },
                  {
                    title: "Done",
                    status: "wait"
                  }
                ] : 
                [
                  {
                    title: "Widthdraw Token",
                    status: getTask(idTask).status === -1 ? 'error' : 
                            ((getTask(idTask).status >  1) ? 'finish' : 'process'),
                    icon:  getTask(idTask).status === 1 && <LoadingOutlined  rev={""}/>
                  },
                  {
                    title: "Save Data",
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
            : 
            <Steps size="default" style={{width: 600, margin: 'auto', marginTop: 40, marginBottom: 30}}
            items={
              idTask === -1 ? 
              [
                {
                  title: "Save Data",
                  status: "wait"
                },
                {
                  title: "Done",
                  status: "wait"
                }
              ] : 
              [
                {
                  title: "Save Data",
                  status: getTask(idTask).status === -1 ? 'error' : (
                            getTask(idTask).status > 1 ? 'finish' : 'process'
                          ),
                  icon:  getTask(idTask).status === 1 && <LoadingOutlined  rev={""}/>                  
                },
                {
                  title: 'Done',
                  status: getTask(idTask).status === 3 ? 'finish' : 'wait'
                }
              ]}
          />
          }
          <div style={{fontWeight: 500}}>
              <p>Status: {
                  idTask === -1  ? 
                      <span style={{fontWeight: 400, color: "#333"}}>Pending</span> 
                  : (getTask(idTask).status === 3 ? 
                      <span style={{fontWeight: 400, color: "#52c41a"}}>Success</span> 
                  : 
                      <span style={{fontWeight: 400, color: '#1677ff'}}>In Progress</span>)}
              </p>
              <p>Owner: <span>{dataOrder.from.address}</span></p>
              
              <p>Network: 
                  <span style={{fontWeight: 400}}> {
                    dataOrder.fromValue.token.network === dataOrder.toValue.token.network ?
                      mappingNetwork(dataOrder.fromValue.token.network)
                    : mappingNetwork(dataOrder.fromValue.token.network) + ' - ' + mappingNetwork(dataOrder.toValue.token.network)  
                  }
                  </span>
              </p>
              <p>Order ID:  
                  <span style={{fontWeight: 400}}> {
                      dataOrder._id
                  }</span>
              </p>
              <p>Transaction Hash:  
                  <span style={{fontWeight: 400}}> {
                      idTask === -1 ? '...' :
                      (getTask(idTask).status === 3 ? getTask(idTask).transactionHash : '...')
                  }</span>
              </p>
          </div>
      </Modal>

      <Modal
          title="Detail Order"
          open={openModal === 2}
          
          onOk={onOkModal}
          okText= {idTask === -1 ? "Confirm" : 'OK'}
          cancelText="Cancel"
          onCancel={() => {setOpenModal(-1); setIdTask(-1)}}

          width={700}
          style={{top: 200}}
          
          closable={true}
      >
        {
          userState.address === dataOrder.from.address ?
          // Step of seller (first create order)
          <Steps size="default" style={{width: 620, margin: 'auto', marginTop: 40, marginBottom: 30}} 
          items={
            idTask === -1 ? 
            [
              { title: "Deposit",
                status: dataOrder.status === "receiver accepted" ? "wait" : "finish" 
              },
              {
                title: "Wait Recipient",
                status: dataOrder.status === "receiver accepted" ? "wait" : (dataOrder.status === "sender accepted" ? "process" : "finish"),
                icon: dataOrder.status === "sender accepted" && <LoadingOutlined  rev={""}/>
              },
              {
                title: "Withdraw",
                status: dataOrder.status === "completed" ? "finish" : "wait",
              },
              {
                title: "Done",
                status: dataOrder.staus === "completed" ? "finish" : "wait"
              },
            ] : 
            [
              {
                title: "Widthdraw Token",
                status: getTask(idTask).status === -1 ? 'error' : 
                        ((getTask(idTask).status >  1) ? 'finish' : 'process'),
                icon:  getTask(idTask).status === 1 && <LoadingOutlined  rev={""}/>
              },
              {
                title: "Save Data",
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
          ]}/>
          :
          // Step of buỷer (create contract first)
          <Steps size="default" style={{width: 620, margin: 'auto', marginTop: 40, marginBottom: 30}} 
          items={
            idTask === -1 ? 
            [
              {
                title: "Deposit",
                status: "finish",
              },
              {
                title: "Wait Recipient",
                status: dataOrder.status === "sender accepted" ? "process" : (dataOrder.status === "receiver accepted" ? "wait" : "finish") ,
                icon: dataOrder.status === "sender accepted" && <LoadingOutlined  rev={""}/>
              },
              {
                title: "Withdraw",
                status: dataOrder.status === "completed" ? "finish" : "wait"
              },
              {
                title: "Done",
                status: dataOrder.status === "completed" ? "finish" : "wait"
              },
            ] : 
            [
              {
                title: "Widthdraw Token",
                status: getTask(idTask).status === -1 ? 'error' : 
                        ((getTask(idTask).status >  1) ? 'finish' : 'process'),
                icon:  getTask(idTask).status === 1 && <LoadingOutlined  rev={""}/>
              },
              {
                title: "Save Data",
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
          ]}/>
          
        }
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 30}}>
            <div >
              <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{dataOrder.fromValue.token.name}</p>
              <p style={{textAlign: "right", fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{dataOrder.fromValue.amount} {dataOrder.fromValue.token.symbol}</p>
            </div>
            <PairToken from_img={dataOrder.fromValue.token.image} to_img={dataOrder.toValue.token.image} width={60}/>
            <div>
                <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{dataOrder.toValue.token.name}</p>
                <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{dataOrder.toValue.amount} {dataOrder.toValue.token.symbol}</p>
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
              <p>Owner: <span style={{fontWeight: 400}}>{dataOrder.from.address}</span></p>
              
              <p>Network: 
                  <span style={{fontWeight: 400}}> {
                    dataOrder.fromValue.token.network === dataOrder.toValue.token.network ?
                      mappingNetwork(dataOrder.fromValue.token.network)
                    : mappingNetwork(dataOrder.fromValue.token.network) + ' - ' + mappingNetwork(dataOrder.toValue.token.network)  
                  }
                  </span>
              </p>
              <p>Order ID:  
                  <span style={{fontWeight: 400}}> {
                      dataOrder._id
                  }</span>
              </p>
              <p>Transaction Hash:  
                  <span style={{fontWeight: 400}}> {
                      idTask === -1 ? '...' :
                      (getTask(idTask).status === 3 ? getTask(idTask).transactionHash : '...')
                  }</span>
              </p>
          </div>
      </Modal>
    </div>
  );
};

export default MyOrderItem;
