import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
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

interface IMyOrderItem {
  data: any
  isPendingOrder?: boolean;
}

const MyOrderItem = ({data, isPendingOrder} : IMyOrderItem) => {
  const dispatch = useAppDispatch()
  const { appState, userState, taskState } = useAppSelector((state) => state)
  const [dataOrder, setDataOrder] = useState<any>(userState.address === data.from.address ? data : {...data, fromValue: data.toValue, toValue: data.fromValue});
  const [openModel, setOpenModal] = useState<boolean>(false);
  const [removeBtn, setRemoveBtn] = useState<any>(<div></div>);
  const [contentOnchain, setContentOnchain] = useState<any>({
    buyer: <div></div>,
    seller: <div></div>
  });





  const IS_SELLER : boolean = userState.address === data.from.address;
  useEffect(() =>     {
    const getContent = async () => {
      setContentOnchain({
        buyer: await contentOnChain(false),
        seller: await contentOnChain(true)
      })
    }
    userState.address === data.from.address ? setDataOrder(data) : 
    setDataOrder({...data, fromValue: data.toValue, toValue: data.fromValue})
      
    getRemoveBtn()
    getContent()
  }, [userState])


  const onClickRemove = () => {
    if (data.fromValue.token.network !== userState.network) {
      requestChangeNetwork(data.fromValue.token.network);
      return;
    }
    let task: ITask = {
      id: taskState.taskList.length,
      status: 0,
      type: "",
      funcExecute: () => {},
      from: {address: userState.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: userState.address, token: data.toValue.token, amount: data.toValue.amount}
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
      
      task = {...task, status: 2, transactionHash: refundRecepit.blockHash}
      dispatch(updateTask({ task, id: task.id }))
      
      await appApi.cancelOrder(data._id)
      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
      
      task = {...task, status: 3}
      dispatch(updateTask({ task: task, id: task.id}))
      
      toast.update(toaster, { render: "The order was removed successfully.", type: "success", isLoading: false, autoClose: 1000});
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
          secretKey
        ).send({from: userState.address})

        dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
        const updateOrder = await appApi.updateStatusOrder(data._id, "completed");
        task = {...task, status: 3}
        dispatch(updateTask({ task: task, id: task.id}))
        toast.update(toaster, { render: "Withdraw token for order successfully.", type: "success", isLoading: false, autoClose: 1000});
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
    }
    if (data.toValue.token.network !== userState.network) {
      requestChangeNetwork(data.toValue.token.network);
      return;
    }
    let task: ITask = {
      id: taskState.taskList.length,
      type: "SELLER-WITHDRAW",
      status: 0,
      funcExecute: sellerWithdraw,
      from: {address: userState.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: userState.address, token: data.toValue.token, amount: data.toValue.amount}
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
      
        await exchangeContract.methods.withdraw(
          generateContractID(appState.web3, data._id, data.from.address, data.to.address),
          secretKey
        ).estimateGas({from: userState.address})

        const withdrawReceipt = await exchangeContract.methods.withdraw(
          generateContractID(appState.web3, data._id, data.from.address, data.to.address),
          secretKey
        ).send({from: userState.address})

        dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
        await appApi.updateStatusOrder(data._id, "receiver withdrawn");
        task = {...task, status: 3}
        dispatch(updateTask({ task: task, id: task.id}))
        toast.update(toaster, { render: "Withdraw token for order successfully.", type: "success", isLoading: false, autoClose: 1000});
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

    if (data.fromValue.token.network !== userState.network) {
      requestChangeNetwork(data.fromValue.token.network);
      return;
    }
    let task: ITask = {
      id: taskState.taskList.length,
      type: "BUYER-WITHDRAW",
      status: 0,
      funcExecute: buyerWithdraw,
      from: {address: userState.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: userState.address, token: data.toValue.token, amount: data.toValue.amount},
      orderID: data._id,
    };
    dispatch(createTask(task));
  }
  const getTimeLockOrder = async () => {
    if (IS_SELLER) {
      const lockOrder = await getTxTwoOnchain(
        generateContractID(appState.web3, data._id, data.from.address, data.to.address), 
        data.fromValue.token.network
      )
      if (lockOrder) return Number(lockOrder.timelock)
    } else {
      const lockOrder = await getTxTwoOnchain(
        generateContractID(appState.web3, data._id, data.from.address, data.to.address), 
        data.toValue.token.network
      )
      if (lockOrder) return Number(lockOrder.timelock)
    }

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
        
        dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
        toast.update(toaster, { render: "Deposit token for order successfully.", type: "success", isLoading: false, autoClose: 1000});
        task = {...task, status: 3, transactionHash: createRecipt.blockHash}
        dispatch(updateTask({ task: task, id: task.id}))
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
      from: {address: userState.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: userState.address, token: data.toValue.token, amount: data.toValue.amount}
    };
    dispatch(createTask(task));
  }
  const textOkBtn = (status: string) => {
    if (IS_SELLER && status === "receiver accepted") {
      return <p>Deposit</p>
    } else if ((IS_SELLER && status === "receiver withdrawn") || (!IS_SELLER && status === "sender accepted")) {
      return <p>Withdraw</p>
    } else {
      return <LoadingOutlined rev={""}/>
    }
  }
  const getRemoveBtn = async () => {
    const timeLock = await getTimeLockOrder()
    let myBtn = <div></div>
    if (IS_SELLER) {
      if (data.status === "receiver accepted") {
        myBtn = <Button>Cancel Order</Button>
      } 
      else if (data.status === "sender accepted") {
        if (timeLock && timeLock * 1000 > Date.now()) {
          myBtn = 
          <Tooltip title="This is the remaining token lock time in the contract." overlayInnerStyle={{textAlign:'center'}}>
            <Button disabled style={{marginRight: 10}}>
              <Countdown value={timeLock * 1000} valueStyle={{fontSize: '1.4rem', fontWeight:700, color:'#ccc'}}/>
            </Button>
          </Tooltip>
        }
        else myBtn = <Button>Refund</Button>
      }
      else myBtn = <div></div>
    } else {
      if (data.status === "sender accepted" || data.status === 'receiver accepted') { 
        if (timeLock && timeLock * 1000 > Date.now()) {
          myBtn = 
            <Tooltip title="This is the remaining token lock time in the contract." overlayInnerStyle={{textAlign:'center'}}>
              <Button disabled style={{marginRight: 10}}>
                <Countdown value={timeLock * 1000} valueStyle={{fontSize: '1.4rem', fontWeight:700, color:'#ccc'}}/>
              </Button>
            </Tooltip>          
        }
        else myBtn = <Button>Refund</Button>
      }
    }
    setRemoveBtn(myBtn)
  }
  const hdOnOk = async (status: string) => {
    console.log('vcl')
      console.log(await getTxTwoOnchain(
    generateContractID(appState.web3, data._id, data.from.address, data.to.address), 
    data.fromValue.token.network)
  )
    if (IS_SELLER) {
      if (status === "receiver accepted") {
        if (data.fromValue.token.network !== userState.network) {
          await requestChangeNetwork(data.fromValue.token.network);
        }
        return onSellerClickDeposit()
      } else if (status === "receiver withdrawn") {
        return onSellerClickWithdraw()
      } else {
        return () => {}
      }
    }
    else {
      if (status === "sender accepted") {
        console.log(data);
        if (data.fromValue.token.network !== userState.network) {
          await requestChangeNetwork(data.fromValue.token.network);
        }
        return onBuyerClickWithdraw()
      } else {
        return () => {}
      }
    }
  }
  const contentOnChain = async (isSeller: boolean) => {
    const txData : any = await getTxTwoOnchain(
      generateContractID(appState.web3, dataOrder._id, data.from.address, data.to.address), 
      !isSeller ? data.toValue.token.nework : data.fromValue.token.network
    )
    if (data.timelock === '0') {
      return (
        <div>
          <p style={{fontSize: '1.3rem'}}>Network:
            <span>{mappingNetwork(!isSeller ? data.toValue.token.nework : data.fromValue.token.network)}</span>
          </p>
          <p style={{fontSize: '1.3rem'}}>Token address:
            <span>{txData.tokenContract}</span>
          </p>
          <p style={{fontSize: '1.3rem'}}>Receiver:
            <span>{txData.receiver}</span>
          </p>
          <p style={{fontSize: '1.3rem'}}>Amount:
            <span>{txData.amount}</span>
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
          <div className="app-order--action--btn" onClick={(data.status === "pending") ? onClickRemove : () => setOpenModal(true)}>
            {
              isPendingOrder ? "Remove" : "Detail"
            }
          </div>
      </div>
      <Modal
          title="Detail Order"
          open={openModel}
          onCancel={() => {setOpenModal(false)}}
          width={800}
          style={{top: 170}}
          closable={true}
          footer={<>
            {removeBtn}
            <Button type="primary" onClick={() => hdOnOk(dataOrder.status)}>{textOkBtn(dataOrder.status)}</Button>
          </>}
      >
        {
          userState.address === dataOrder.from.address ?
          // Step of seller (first create order)
          <Steps size="default" style={{width: 700, margin: 'auto', marginTop: 20, marginBottom: 30}} 
          items={
            [
              { title: "Deposit",
                status: dataOrder.status === "receiver accepted" ? "process" : "finish" 
              },
              {
                title: "Wait Recipient",
                status: dataOrder.status === "receiver accepted" ? "wait" : (dataOrder.status === "sender accepted" ? "process" : "finish"),
                icon: dataOrder.status === "sender accepted" && <LoadingOutlined  rev={""}/>
              },
              {
                title: "Withdraw",
                status: dataOrder.status === "completed" ? "finish" : (dataOrder.status === "receiver withdrawn" ? "process" : "wait"),
              },
              {
                title: "Done",
                status: dataOrder.staus === "completed" ? "finish" : "wait"
              },
            ]}/>
          :
          // Step of buyer (create contract first)
          <Steps size="default" style={{width: 620, margin: 'auto', marginTop: 40, marginBottom: 30}} 
          items={
            [
              {
                title: "Deposit",
                status: "finish",
              },
              {
                title: "Wait Recipient",
                status: data.status === "receiver accepted" ? "process" : "finish",
                icon: data.status === "receiver accepted" && <LoadingOutlined  rev={""}/>
              },
              {
                title: "Withdraw",
                status: data.status === "sender accepted" ? "process" : (
                  (data.status === "receiver withdrawn" || data.status === "completed") ? "finish" : "wait")
              },
              {
                title: "Done",
                status: (data.status === "completed" || data.status === "receiver withdrawn") ? "finish" : "wait"
              },
            ]}/>

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
              {dataOrder.fromValue.amount} {dataOrder.toValue.token.symbol}
            </p>
          </div>
        </div>

          <div style={{fontWeight: 500, padding: "0 20px"}}>
              <p>Recipient: <span style={{fontWeight: 400}}>{dataOrder.from.address}</span></p>
              <p>Order ID:  
                  <span style={{fontWeight: 400}}> {
                      dataOrder._id
                  }</span>
              </p>
              <p>Lock contract ID:  
                  <span style={{fontWeight: 400}}> {
                      generateContractID(appState.web3, dataOrder._id, dataOrder.from.address, dataOrder.to.address)
                  }</span>
              </p>
              <p>Onchain data:</p>
              <div style={{display: "flex", flexDirection:"row", alignItems:'flex-start', flex: 1}}>
                <Collapse
                  size="small"
                  style={{flex: 0.48, marginRight: 20}}
                  items={[{ key: '1', label: 'Buyer lock contract', children: contentOnchain.buyer}]}
                  bordered={false}
                />
                <Collapse
                  size="small"
                  style={{flex: 0.48}}
                  items={[{ key: '1', label: 'Seller lock contract', children: contentOnchain.seller}]}
                  bordered={false}
                />
              </div>
          </div>
      </Modal>
    </div>
  )  
};

export default MyOrderItem;
