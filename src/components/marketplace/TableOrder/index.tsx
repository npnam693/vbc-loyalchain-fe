import { Divider } from "antd";

import "./TableOrder.scss";
import { shortenAddress } from "../../../utils/string";
import PairToken from "../../app/PairToken";
import { getAddressOneChainContract, getAddressTwoChainContract, getBalanceAccount, mappingNetwork } from "../../../utils/blockchain";
import { ITask, ITaskState, createTask, doneOneTask, updateTask } from "../../../state/task/taskSlice";
import { toast } from "react-toastify";
import { getSwapOneContract, getSwapTwoContract, getTokenContract } from "../../../services/contract";
import { saveInfo } from "../../../state/user/userSlice";
import appApi from "../../../api/appAPI";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { useEffect, useState } from "react";
import { requestChangeNetwork } from "../../../services/metamask";

const baseTable = [
  { title: "ID", size: 0.1},
  { title: "Transaction", size:  0.1, },
  { title: "Swap from", size:  0.1, },
  { title: "Swap to", size:  0.1, },
  { title: "Network", size:  0.2, },
  { title: "Exchange rate", size:  0.1 },
  { title: "Creator", size: 0.3}
];


export default function TableOrder(props : any) {
  const dispatch = useAppDispatch()
  const {appState, userState, taskState} = useAppSelector(state => state)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (data !== null) {
      onClickAccept()
    }
    console.log(data)
  }, [data])

  const standardizeData = props.data.map((item : any) => {
    const itemData : any = []
    itemData.push('#' + item._id.slice(0,4) + '...' + item._id.slice(-5))
    itemData.push(< PairToken from_img={item.fromValue.token.image} to_img={item.toValue.token.image} />)
    itemData.push(`${item.fromValue.amount} ${item.fromValue.token.symbol}`)
    itemData.push(`${item.toValue.amount} ${item.toValue.token.symbol}`)
    itemData.push(                item.fromValue.token.network === item.toValue.token.network ?
      mappingNetwork(item.toValue.token.network) : 
      mappingNetwork(item.toValue.token.network)?.slice(0, Number(mappingNetwork(item.fromValue.token.network)?.length) -  8) + " - " + mappingNetwork(item.toValue.token.network))
    itemData.push((item.toValue.amount / item.fromValue.amount).toFixed(2))
    itemData.push(item.from.address)
    return itemData
  })



  const buyerAccept = async  (taskState: ITaskState, idTask: number, secretKey: string | undefined) => {
    const toaster = toast.loading("Approving token...")
    let task : ITask = {...taskState.taskList[idTask], status: 1}
    dispatch(updateTask({task, id: idTask}))

    

    try {
      const swapContract = getSwapTwoContract(appState.web3, userState.network);
      const tokenContract = getTokenContract(appState.web3, data.toValue.token.deployedAddress)
      const SWAP_ADDRESS_CONTRACT = getAddressTwoChainContract(userState.network)

      // Approve token
      await tokenContract.methods.approve(
        SWAP_ADDRESS_CONTRACT,
        BigInt(10 ** Number(18) * Number(data?.toValue.amount)),
      ).send({from: userState.address})
      
      dispatch(updateTask({
        task: {...task, status: 2}, 
        id: task.id
      }))

      toast.update(toaster, { render: "Depositing token...", type: "default", isLoading: true});
      
      const createRecepit = await swapContract.methods.create(
        appState.web3.utils.keccak256(data?._id),
        data?.from.address,
        data?.toValue.token.deployedAddress,
        BigInt(10 ** Number(18) * Number(data?.toValue.amount)),
        appState.web3.utils.keccak256(secretKey),
        false,
      ).send({from: userState.address})

      // Save order to database
      await appApi.acceptOder(
        data?._id,
        { hashlock: appState.web3.utils.keccak256(secretKey)}
      )

      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
      toast.update(toaster, { render: "The order was accepted successfully.", type: "success", isLoading: false, autoClose: 1000});
      task = {...task, status: 3, transactionHash: createRecepit.transactionHash}
      dispatch(updateTask({ task: task,  id: task.id }))
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
  const confirmOneChain = async  (taskState: ITaskState, idTask: number) => {
    const toaster = toast.loading("Approving token...")
    let task : ITask = {...taskState.taskList[idTask], status: 1}
    dispatch(updateTask({task, id: idTask}))
    try {
      const swapContract = getSwapOneContract(appState.web3, userState.network);
      const tokenContract = getTokenContract(appState.web3, data?.toValue.token.deployedAddress)
      const SWAP_ADDRESS_CONTRACT = getAddressOneChainContract(userState.network)
      
      await tokenContract.methods.approve(
        SWAP_ADDRESS_CONTRACT,
        BigInt(10 ** Number(18) * Number(data?.toValue.amount)),
      ).send({from: userState.address})

      task = {...task, status: 2}
      dispatch(updateTask({ task, id: task.id}))

      toast.update(toaster, { render: "Buying token...", type: "default", isLoading: true});
      
      const swapMethod = swapContract.methods.acceptTx(data?.contractId)

      await swapMethod.estimateGas({from: userState.address})

      const acceptRecepit = await swapMethod.send({from: userState.address})

      await appApi.acceptOder(data?._id)
      
      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
      toast.update(toaster, { render: "The order was accepted successfully.", type: "success", isLoading: false, autoClose: 1000});
      task = {...task, status: 3, transactionHash: acceptRecepit.transactionHash}
      dispatch(updateTask({ 
        task: task, 
        id: task.id
      }))
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
  const onClickAccept = async () => {
    if (data?.toValue.token.network !== userState.network) {
      requestChangeNetwork(data?.toValue.token.network);
      return;
    }
    if (data?.from.address === userState.address) {
      alert("You can't accept your order!")
      return;
    }
    let task: ITask = {
      id: taskState.taskList.length,
      type: "",
      status: 0,
      funcExecute: () => {},
      from: {address: data?.from.address, token: data?.fromValue.token, amount: data?.fromValue.amount},
      to: {address: userState.address, token: data?.toValue.token, amount: data?.toValue.amount},
      orderID: data?._id
    }
    if (data?.fromValue.token.network === data?.toValue.token.network) {
      task = {...task, type: "ACCEPT", funcExecute: confirmOneChain}
    } else {
      task = {...task, type: "BUYER-DEPOSIT", funcExecute: buyerAccept}
    }
    dispatch(createTask(task));
  }
  
  return (
    <div className="app-order_table">
      <div className="header">
        {baseTable.map((element, index) => (
          <div className="header-item" style={{ flex: element.size }}>
            {element.title}
          </div>
        ))}
      </div>

      <Divider className="divider" />

      <div className="list-content">
        {
          standardizeData.map((item : any, index : number) => (
            <div className="content-item" onClick={() => setData(props.data[index])}>
              <div className="item-field">
                {item.map((element : any, index : number) => (
                  <div className="header-item" style={{ flex: Number(baseTable[index].size)}}>
                    {element}
                  </div>
                ))}
            </div>
          </div>
          ))
        }
      </div>
    </div>
  );
}
