import { CheckCircleTwoTone, LoadingOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Collapse, Divider, Modal, Steps, Tooltip } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import "./MyOrderItem.scss";
import appApi from "../../../api/appAPI";
import { useAppSelector } from "../../../state/hooks";
import { useAppDispatch } from "../../../state/hooks";
import { saveInfo } from "../../../state/user/userSlice";
import {  ITask, ITaskState, createTask, doneOneTask, updateTask } from "../../../state/task/taskSlice";
import { getSwapOneContract, getSwapTwoContract, getTokenContract } from "../../../services/contract";
import { getAddressOneChainContract, getAddressTwoChainContract, getBalanceAccount, mappingNetwork } from "../../../utils/blockchain";
import { requestChangeNetwork } from "../../../services/metamask";
import Countdown from "antd/es/statistic/Countdown";
import PairToken from "../../app/PairToken";
import { generateContractID, getTxTwoOnchain } from "../../../services/blockchain";
import store from "../../../state";
import { fixStringBalance } from "../../../utils/string";
interface IMyOrderItem {
  data: any
  isPendingOrder?: boolean;
  rerender?: () => void
}

const MyOrderItem = ({data, isPendingOrder, rerender} : IMyOrderItem) => {
  const dispatch = useAppDispatch()
  const { appState, userState, taskState } = useAppSelector((state) => state)
  const [dataOrder, setDataOrder] = useState<any>(userState.address === data.from.address ? data : {...data, fromValue: data.toValue, toValue: data.fromValue});
  const [openModel, setOpenModal] = useState<boolean>(false);
  const [removeBtn, setRemoveBtn] = useState<any>(<div></div>);
  const [okBtn, setOkBtn] = useState<any>(<div></div>);
  const [contentOnchain, setContentOnchain] = useState<any>({
    buyer: <div></div>,
    seller: <div></div>
  });
  const [dataOnChain, setDataOnChain] = useState<any>(null)
  const IS_SELLER : boolean = userState.address === data.from.address;
  
  const getDataOnChain = async () => {
    const sellerLock = await getTxTwoOnchain(
      generateContractID(appState.web3, data._id, data.from.address, data.to.address), 
      data.fromValue.token.network
    )
    const buyerLock = await getTxTwoOnchain(
      generateContractID(appState.web3, data._id, data.from.address, data.to.address), 
      data.toValue.token.network
    )

    setDataOnChain({
      seller: sellerLock,
      buyer: buyerLock
    })
    
    IS_SELLER ? getRemoveBtn(sellerLock.timelock) : getRemoveBtn(buyerLock.timelock)
    
    setContentOnchain({
      seller: makecontentOnChain(true, sellerLock),
      buyer: makecontentOnChain(false, buyerLock)
    })
  }

  

  useEffect(() =>     {
    userState.address === data.from.address ? setDataOrder(data) : 
    setDataOrder({...data, fromValue: data.toValue, toValue: data.fromValue})
    if (openModel) {
      getDataOnChain()
      setOkBtn(textOkBtn(data.status))
    }
  }, [userState, data.status])

  const onClickRemove = async () => {
    const storeData = store.getState()  
    let task: ITask = {
      id: taskState.taskList.length,
      status: 0,
      type: "",
      funcExecute: () => {},
      from: {address: data.from.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: data.to.address, token: data.toValue.token, amount: data.toValue.amount},
      orderID: data._id
    }

    // Check whether the order is swap one chain or two chain.
    if (data.fromValue.token.network === data.toValue.token.network) {
      task = {...task, type: "REMOVE", funcExecute: removeOrder1Chain}
    }
    else {
      task = {...task, type: "SELLER-REMOVE", funcExecute: removeOrder2Chain}
    }
    dispatch(createTask(task));
  }
  const removeOrder1Chain = async (taskState: ITaskState, idTask: number) => {
    const toaster = toast.loading("Remove Order..")
    let task : ITask = {...taskState.taskList[idTask], status: 1}
    dispatch(updateTask({task, id: idTask}))
    try {
      const exchangeContract = getSwapOneContract(appState.web3, userState.network);
      const SWAP_ADDRESS_CONTRACT = getAddressOneChainContract(userState.network)
      
      const refundMethod = exchangeContract.methods.refund( data.txId )
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
      
      task = {...task, status: 2, transactionHash: refundRecepit.transactionHash}
      dispatch(updateTask({ task, id: task.id }))
      
      await appApi.cancelOrder(data._id)
      
      dispatch(saveInfo({...userState, 
        wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
        balance:fixStringBalance(String(
            await appState.web3.eth.getBalance(userState.address)
        ), 18)})
      )
      
      task = {...task, status: 3}
      dispatch(updateTask({ task: task, id: task.id}))
      
      toast.update(toaster, { render: "The order was removed successfully.", type: "success", isLoading: false, autoClose: 1000});
      rerender && rerender()
    } catch (error) {
      dispatch(updateTask({ task: { ...task, status: -1 }, id: task.id}))
      toast.update(toaster, { render: "Remove order fail.", type: "error", isLoading: false, autoClose: 1000});
    }
    dispatch(doneOneTask())
  }
  const removeOrder2Chain = async (taskState: ITaskState, idTask: number) => {
    const toaster = toast.loading("Remove Order...")
    let task : ITask = {...taskState.taskList[idTask], status: 1}
    dispatch(updateTask({task, id: idTask}))
    try {
      await appApi.cancelOrder(data._id)
      task = {...task, status: 3}
      dispatch(updateTask({
        task: task, 
        id: task.id
      }))
      toast.update(toaster, { render: "The order was removed successfully.", type: "success", isLoading: false, autoClose: 1000});
      rerender && rerender()
    } catch (error) {
      console.log(error)
      toast.update(toaster, { render: "Remove order fail.", type: "error", isLoading: false, autoClose: 1000});
      dispatch(updateTask({
        task: { ...task, status: -1}, 
        id: task.id
      }))
    }
    dispatch(doneOneTask())
  }
  const onSellerClickWithdraw = () => {
    const sellerWithdraw = async  (taskState: ITaskState, idTask: number) => {
      const toaster = toast.loading("Withdraw token...")
      let task : ITask = {...taskState.taskList[idTask], status: 2}
      dispatch(updateTask({task, id: idTask}))
      try {
        const exchangeContract = getSwapTwoContract(appState.web3, data.toValue.token.network);

        const secretKey = await appApi.getScretKey(data._id)

        const withdrawMethod = await exchangeContract.methods.withdraw(
          generateContractID(appState.web3, data._id, data.from.address, data.to.address),
          secretKey?.data
        ).send({from: userState.address})

        dispatch(saveInfo({...userState, 
          wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
          balance:fixStringBalance(String(
              await appState.web3.eth.getBalance(userState.address)
          ), 18)})
      )

        const updateOrder = await appApi.updateStatusOrder(data._id, "completed");
        task = {...task, status: 3}
        dispatch(updateTask({ task: task, id: task.id}))
        toast.update(toaster, { render: "Withdraw token for order successfully.", type: "success", isLoading: false, autoClose: 1000});
        rerender && rerender()
      } catch (error) {
        console.log(error);
        dispatch(updateTask({
          task: {
              ...task, 
              status: -1,
          }, 
          id: task.id
        }))
        toast.update(toaster, { render: "Accept order fail, check your secret key", type: "error", isLoading: false, autoClose: 1000});
      }
      dispatch(doneOneTask())
    }
    let task: ITask = {
      id: taskState.taskList.length,
      type: "SELLER-WITHDRAW",
      status: 0,
      funcExecute: sellerWithdraw,
      from: {address: data.from.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: data.to.address, token: data.toValue.token, amount: data.toValue.amount},
      orderID: data._id,
    };

    dispatch(createTask(task));
  }
  const onBuyerClickWithdraw = () => {
    const buyerWithdraw = async (taskState: ITaskState, idTask: number, secretKey: string | undefined ) => {
      const toaster = toast.loading("Withdraw token...")
      let task : ITask = {...taskState.taskList[idTask], status: 1}
      dispatch(updateTask({task, id: idTask}))
      try {
        const exchangeContract = getSwapTwoContract(appState.web3, data.fromValue.token.network);
        console.log(secretKey)
        await exchangeContract.methods.withdraw(
          generateContractID(appState.web3, data._id, data.from.address, data.to.address),
          secretKey
        ).estimateGas({from: userState.address})

        const withdrawReceipt = await exchangeContract.methods.withdraw(
          generateContractID(appState.web3, data._id, data.from.address, data.to.address),
          secretKey?.toString()
        ).send({from: userState.address})

        dispatch(saveInfo({...userState, 
          wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
          balance: fixStringBalance(String(
              await appState.web3.eth.getBalance(userState.address)
          ), 18)})
        )

        await appApi.updateStatusOrder(data._id, "receiver withdrawn");
        task = {...task, status: 3}
        dispatch(updateTask({ task: task, id: task.id}))
        toast.update(toaster, { render: "Withdraw token for order successfully.", type: "success", isLoading: false, autoClose: 1000});
        console.log('alo')
        rerender && rerender()
      } catch (error) {
        console.log(error);
        dispatch(updateTask({
          task: {
              ...task, 
              status: -1,
          }, 
          id: task.id
        }))
        toast.update(toaster, { render: "Accept order fail, check your secret key", type: "error", isLoading: false, autoClose: 1000});
      }
      dispatch(doneOneTask())
    }
    let task: ITask = {
      id: taskState.taskList.length,
      type: "BUYER-WITHDRAW",
      status: 0,
      funcExecute: buyerWithdraw,
      from: {address: data.from.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: data.to.address, token: data.toValue.token, amount: data.toValue.amount},
      orderID: data._id,
    };
    dispatch(createTask(task));
  }
  const onSellerClickDeposit = () => {
    const sellerDeposit = async (taskState: ITaskState, idTask: number) => {
      const toaster = toast.loading("Approving token...")
      let task : ITask = {...taskState.taskList[idTask], status: 1}
      dispatch(updateTask({task, id: idTask}))
      try {
        const exchangeContract = getSwapTwoContract(appState.web3, userState.network);
        const tokenContract = getTokenContract(appState.web3, data.fromValue.token.deployedAddress)
        const SWAP_ADDRESS_CONTRACT = getAddressTwoChainContract(userState.network)
        
        await tokenContract.methods.approve(
          SWAP_ADDRESS_CONTRACT,
          BigInt(10 ** Number(18) * Number(data.fromValue.amount)),
        ).send({from: userState.address})

        task = {...task, status: 2}
        dispatch(updateTask({ task: task, id: task.id}))
        toast.update(toaster, { render: "Deposit token...", type: "default", isLoading: true});

        const createRecipt = await  exchangeContract.methods.create(
          appState.web3.utils.soliditySha3(data._id),
          data.to.address,
          data.fromValue.token.deployedAddress,
          BigInt(10 ** Number(18) * Number(data.fromValue.amount)),
          data.hashlock,
          true,
        ).send({from: userState.address})
        
        console.log(await appApi.updateStatusOrder(data._id, "sender accepted")
        )
        
        dispatch(saveInfo({...userState, 
          wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
          balance:fixStringBalance(String(
              await appState.web3.eth.getBalance(userState.address)
          ), 18)})
        )

        toast.update(toaster, { render: "Deposit token for order successfully.", type: "success", isLoading: false, autoClose: 1000});
        task = {...task, status: 3, transactionHash: createRecipt.transactionHash}
        dispatch(updateTask({ task: task, id: task.id}))
        rerender && rerender()
        setOpenModal(false)
      } catch (error) {
        console.log(error);
        dispatch(updateTask({
          task: {
              ...task, 
              status: task.status === 1 ? -1 : -2 ,
          }, 
          id: task.id
        }))
        toast.update(toaster, { render: "Accept order fail, see detail in console!", type: "error", isLoading: false, autoClose: 1000});
      }
      dispatch(doneOneTask())
    }
    let task: ITask = {
      id: taskState.taskList.length,
      type: "SELLER-DEPOSIT",
      status: 0,
      funcExecute: sellerDeposit,
      from: {address: data.from.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: data.to.address, token: data.toValue.token, amount: data.toValue.amount},
      orderID: data._id,
    };
    dispatch(createTask(task));
  }
  const onClickRefund = async () => {
    const storeData = store.getState()  
    const refundToken = async (taskState: ITaskState, idTask: number) => {
      const toaster = toast.loading("Refunding token...")
      let myTask : ITask = {...taskState.taskList[idTask], status: 1}
      dispatch(updateTask({task: myTask, id: idTask}))
      try {
          const nonce = await appState.web3.eth.getTransactionCount(storeData.userState.address)
          const signatureAdmin = await appApi.getSignatureAdmin(
            data._id,
            nonce
          )
          myTask = {...taskState.taskList[idTask], status: 2}
          dispatch(updateTask({task: myTask, id: idTask}))
          const swapContract = getSwapTwoContract(appState.web3, data.fromValue.token.network)
          const refundMethod = swapContract.methods.refund(
            generateContractID(appState.web3, data._id, data.from.address, data.to.address),
            Number(nonce),
            signatureAdmin.data,
          )
          console.log(await refundMethod.estimateGas({from: storeData.userState.address}))
          const refundRecipt = await refundMethod.send({from: storeData.userState.address})
          const cancelOrder = await appApi.cancelOrder(data._id)
          myTask = {...taskState.taskList[idTask], status: 3, transactionHash: refundRecipt.transactionHash}
          dispatch(updateTask({task: myTask, id: idTask}))
          dispatch(saveInfo({...userState, 
            wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
            balance:fixStringBalance(String(
                await appState.web3.eth.getBalance(userState.address)
            ), 18)})
          )
          toast.update(toaster, { render: "Token was refund successfully.", type: "success", isLoading: false, autoClose: 1000});
          rerender && rerender()
      } catch (error) {
        dispatch(updateTask({ 
          task: { ...task, status: task.status === 1 ? -1 : -2 }, 
          id: task.id})
        )
        toast.update(toaster, { render: "Refund token fail.", type: "error", isLoading: false, autoClose: 1000});
      }
      dispatch(doneOneTask())
    }
    let networkAction = IS_SELLER ? data.fromValue.token.network : data.toValue.token.network;
    if (storeData.userState.network !== networkAction) {
      await requestChangeNetwork(networkAction)
      return;
    }
    let task: ITask = {
      id: taskState.taskList.length,
      type: "REFUND",
      status: 0,
      funcExecute: refundToken,
      from: {address: data.from.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: data.to.address, token: data.toValue.token, amount: data.toValue.amount},
      orderID: data._id,
    };
    dispatch(createTask(task));
  }







  
  // ----------------------------------------------- //
  const textOkBtn = (status: string) => {
    if (IS_SELLER && status === "receiver accepted") {
      return <p>Deposit</p>
    } else if ((IS_SELLER && status === "receiver withdrawn") || (!IS_SELLER && status === "sender accepted")) {
      return <p>Withdraw</p>
    } else if (status === 'completed') {
      return <p>OK</p>
    }
    else {
      return <LoadingOutlined rev={""}/>
    }
  }
  const getRemoveBtn = async (timeLock: number) => {
    console.log(timeLock, data, IS_SELLER)
    let myBtn = <div></div>
    if (IS_SELLER) {
      if (data.status === "receiver accepted") {
        myBtn = <Button onClick={onClickRemove}>Cancel Order</Button>
      } 
      else if (data.status === "sender accepted" || data.status === "receiver cancelled") {
        if (timeLock && timeLock * 1000 > Date.now()) {
          myBtn = 
          <Tooltip title="This is the remaining token lock time in the contract." overlayInnerStyle={{textAlign:'center'}}>
            <Button disabled style={{marginRight: 10}}>
              <Countdown value={timeLock * 1000} valueStyle={{fontSize: '1.4rem', fontWeight:700, color:'#ccc'}}/>
            </Button>
          </Tooltip>
        }
        else myBtn = <Button onClick={onClickRefund}>Refund</Button>
      }
      else if (data.status === "sender cancelled") {
        myBtn = <Button onClick={() => {}} disabled>You have refunded.</Button>
      }
      else myBtn = <div></div>
    } else {
      if (data.status === "sender accepted" || data.status === 'receiver accepted' || data.status === "sender cancelled") { 
        if (timeLock && timeLock * 1000 > Date.now()) {
          myBtn = 
            <Tooltip title="This is the remaining token lock time in the contract." overlayInnerStyle={{textAlign:'center'}}>
              <Button disabled style={{marginRight: 10}}>
                <Countdown value={timeLock * 1000} valueStyle={{fontSize: '1.4rem', fontWeight:700, color:'#ccc'}}/>
              </Button>
            </Tooltip>          
        }
        else myBtn = <Button onClick={onClickRefund}>Refund</Button>
      }
      else if (data.status === "receiver cancelled") {
        myBtn = <Button onClick={() => {}} disabled>You have refunded.</Button>
      }
      else myBtn = <div></div>
    }
    setRemoveBtn(myBtn)
  }
  const hdOnOk = async (status: string) => {
    if (IS_SELLER) {
      if (status === "receiver accepted") {
        if (data.fromValue.token.network !== userState.network) {
          await requestChangeNetwork(data.fromValue.token.network);
          return;
        }
        return onSellerClickDeposit()
      } else if (status === "receiver withdrawn") {
        return onSellerClickWithdraw()
      } else {
        return setOpenModal(false)
      }
    }
    else {
      if (status === "sender accepted") {
        if (data.fromValue.token.network !== userState.network) {
          await requestChangeNetwork(data.fromValue.token.network);
          return;
        }
        return onBuyerClickWithdraw()
      } else {
        return setOpenModal(false)
      }
    }
  }
  const getProgress = () => {
    // 'receiver accepted', 'sender accepted', 'receiver withdrawn', 'completed'
    if (IS_SELLER){
      switch (data.status) {
        case "receiver accepted":
          return "Deposit Token"
        case "sender accepted":
          return "Waiting recipient"
        case "receiver withdrawn":
          return "Withdraw Token"
        case "sender cancelled":
          return "Refund Token" 
        case "receiver cancelled":
          return "Refund Token" 
      }
    }
    else {
      switch (data.status) {
        case "receiver accepted":
          return "Waiting Recipient"
        case "sender accepted":
          return "Withdraw Token"
        case "receiver withdrawn":
          return "Done"
        case "receiver cancelled":
          return "Refund Token"
        case "sender cancelled":
          return "Refund Token"  
      }
    }
  }
  const makecontentOnChain = (isSeller: boolean, txData: any) => {
    console.log(data)
    if (txData.timelock.toString() !== '0') {
      return (
        <div>
          <p style={{fontSize: '1.3rem'}}>Network:
            <span style={{fontWeight: 400}}>{' '}{mappingNetwork(!isSeller ? data.toValue.token.network : data.fromValue.token.network)}</span>
          </p>
          <p style={{fontSize: '1.3rem'}}>Token address:
            <span style={{fontWeight: 400}}>{' '}{txData.tokenContract.toString()}</span>
          </p>
          <p style={{fontSize: '1.3rem'}}>Receiver:
            <span style={{fontWeight: 400}}>{' '}{txData.receiver.toString()}</span>
          </p>
          <p style={{fontSize: '1.3rem'}}>Amount:
            <span style={{fontWeight: 400}}>{' '}{txData.amount.toString()}</span>
          </p>
          <p style={{fontSize: '1.3rem'}}>Status:
            <span style={{fontWeight: 400}}>{' '}{txData.status === '0' ? 'Pending' : (txData.status === '1' ? "Withdrawn" : "Refunded")}</span>
          </p>
        </div>
        )
    }
    else {
      return (
        <div>There is currently no on-chain information available for this lock contract.</div>
      )
    }
  }
  return (
    <div className="app-order" >
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
                {
                  <p style={{textAlign:'right'}}>
                    {
                      IS_SELLER ? 
                      'Sell' : 'Buy'
                    }
                  </p>
                }
                <p>{getProgress()}</p>
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
          <div className="app-order--action--btn" onClick={(data.status === "pending") ? onClickRemove : async () => {
            setOpenModal(true)
            await getDataOnChain()
          }}>
            {
              isPendingOrder ? "Remove" : "Detail"
            }
          </div>
      </div>
      {
        <Modal
            title="Detail Order"
            open={openModel}
            onCancel={() => {setOpenModal(false)}}
            width={900}
            style={{top: 170}}
            closable={true}
            footer={<>
              {removeBtn}
              {
                (data.status !== 'cancel' && data.status !== 'sender cancel' && data.status !== 'receiver cancelled' && data.status !== "sender cancelled") && 
                <Button 
                  type="primary" disabled={(!IS_SELLER && data.status === "receiver withdrawn") ? true : false}
                  onClick={() => hdOnOk(dataOrder.status)}>
                    {
                      (!IS_SELLER && data.status === "receiver withdrawn") ? "You have withdrawn" :
                      textOkBtn(dataOrder.status)
                    }
                </Button>
              }
            </>}
        >
          {
            userState.address === dataOrder.from.address ?
            // Step of seller (first create order) SELLER
            <Steps size="default" style={{width: 800, margin: 'auto', marginTop: 20, marginBottom: 30}} 
            items={
              data.status === 'receiver accepted' ? 
              [
                {title: "Deposit", status: "process"},
                {title: "Wait Recipient", status: "wait"},
                {title: "Withdraw", status: "wait"},
                {title: "Done", status: "wait"}
              ] : (
              data.status === 'sender accepted' ? 
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "process", icon: <LoadingOutlined  rev={""}/>},
                {title: "Withdraw", status: "wait"},
                {title: "Done", status: "wait"}
              ] : (
              data.status === 'receiver withdrawn' ?
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "finish"},
                {title: "Withdraw", status: "process"},
                {title: "Done", status: "wait"}
              ] : (
              data.status === 'completed' ? 
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "finish"},
                {title: "Withdraw", status: "finish"},
                {title: "Done", status: "finish"}
              ] : (
              data.status === 'sender cancelled' ? 
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "error"},
                {title: "Withdraw", status: "wait"},
                {title: "Done", status: "wait"}
              ]  : // "receiver cancelled"
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "error"},
                {title: "Withdraw", status: "wait"},
                {title: "Done", status: "wait"}
              ]
              ))))
            }
            />
            :
            // Step of buyer (create contract first)
            <Steps size="default" style={{width: 800, margin: 'auto', marginTop: 20, marginBottom: 30}} 
            items={
              data.status === 'receiver accepted' ? 
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "process", icon: <LoadingOutlined rev={""} />},
                {title: "Withdraw", status: "wait"},
                {title: "Done", status: "wait"}
              ] : (
              data.status === 'sender accepted' ? 
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "finish"},
                {title: "Withdraw", status: "wait"},
                {title: "Done", status: "wait"}
              ] : (
              data.status === 'receiver withdrawn' ?
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "finish"},
                {title: "Withdraw", status: "finish"},
                {title: "Done", status: "finish"}
              ] : (
              data.status === 'completed' ? 
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "finish"},
                {title: "Withdraw", status: "finish"},
                {title: "Done", status: "finish"}
              ] : (
              data.status === 'sender cancelled' ? 
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "error"},
                {title: "Withdraw", status: "wait"},
                {title: "Done", status: "wait"}
              ]  : // "receiver cancelled"
              [
                {title: "Deposit", status: "finish"},
                {title: "Wait Recipient", status: "error"},
                {title: "Withdraw", status: "wait"},
                {title: "Done", status: "wait"}
              ]
              ))))
            }/>

          }
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30}}>
            <div>
              <p style={{ fontSize: "1.6rem", fontWeight: 500, lineHeight: "1.6rem"}}>
                {dataOrder.fromValue.token.name}
              </p>
              <p style={{textAlign: "right"}}>{mappingNetwork(dataOrder.fromValue.token.network)}</p>
              <p style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--color-secondary)", textAlign: "right"}}>
                {dataOrder.fromValue.amount} {dataOrder.fromValue.token.symbol}
              </p>
            </div>
            <PairToken
              from_img={dataOrder.fromValue.token.image}
              to_img={dataOrder.toValue.token.image}
              width={60}
            />
          <div>
              <p
                style={{ fontSize: "1.6rem", fontWeight: 500, lineHeight: "1.6rem",}}
              >
                {dataOrder.toValue.token.name}
              </p>
              <p>{mappingNetwork(dataOrder.toValue.token.network)}</p>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--color-secondary)",
                }}
              >
                {dataOrder.toValue.amount} {dataOrder.toValue.token.symbol}
              </p>
            </div>
          </div>

            <div style={{fontWeight: 500}}>
                {
                  data.status !== "pending" &&
                  <p>Recipient: <span style={{fontWeight: 400}}>{IS_SELLER ? data.to?.address : data.from.address}</span></p>
                }
                <p>Order ID:  
                    <span style={{fontWeight: 400}}> {
                        data._id
                    }</span>
                </p>
                {
                  data.status !== "pending" &&
                  <>
                  <p>Lock contract ID:  
                    <span style={{fontWeight: 400}}> {
                        generateContractID(appState.web3, data._id, data.from.address, data.to.address)
                    }</span>
                </p>
                <p>Onchain data:</p>
                <div style={{display: "flex", flexDirection:"row", alignItems:'flex-start', flex: 1}}>
                    <Collapse
                      size="small"
                      style={{flex: 0.5, marginRight: 20}}
                      items={[{label: <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <p>Buyer lock contract</p>
                        {
                          (IS_SELLER && dataOnChain != null && dataOnChain.buyer.timelock !== "0")  &&
                          <Tooltip title="On-chain data confirmed accurate.">
                            <CheckCircleTwoTone twoToneColor="#52c41a" rev={""} style={{fontSize: '2rem', marginRight: 10}}/>
                          </Tooltip>
                        }
                      </div>, 
                      children: contentOnchain.buyer ? contentOnchain.buyer : <></>}]}
                      bordered={false}
                    />
                    <Collapse
                      size="small"
                      style={{flex: 0.5}}
                      items={[{label: 
                      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <p>Seller lock contract</p>
                        {
                          (!IS_SELLER && dataOnChain != null && dataOnChain.seller.timelock !== "0")  &&
                          <Tooltip title="On-chain data confirmed accurate.">
                            <CheckCircleTwoTone twoToneColor="#52c41a" rev={""} style={{fontSize: '2rem', marginRight: 10}}/>
                          </Tooltip>
                        }
                      </div>
                    , children: contentOnchain.seller ? contentOnchain.seller : <></>}]}
                      bordered={false}
                    />
                </div>
                  </>
                  
                }
                
            </div>
        </Modal>
      }
    </div>
  )  
};

export default MyOrderItem;
