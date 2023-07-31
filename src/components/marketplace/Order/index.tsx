import { SwapOutlined } from "@ant-design/icons";
import { Divider, Skeleton,} from "antd";
import { toast } from "react-toastify";

import "./Order.scss";
import appApi from "../../../api/appAPI";
import { useAppSelector } from "../../../state/hooks";
import { useAppDispatch } from "../../../state/hooks";
import { saveInfo } from "../../../state/user/userSlice";
import { ITask, ITaskState, createTask, doneOneTask, updateTask } from "../../../state/task/taskSlice";
import { getSwapOneContract, getTokenContract, getSwapTwoContract } from "../../../services/contract";
import { getAddressOneChainContract, getAddressTwoChainContract, getBalanceAccount, mappingNetwork } from "../../../utils/blockchain";
import { requestChangeNetwork } from "../../../services/metamask";
import { fixStringBalance } from "../../../utils/string";


interface IOrderItemProps {
  data: any
  skeleton?: boolean
}

const Order = ({data, skeleton} : IOrderItemProps) => {
  const dispatch = useAppDispatch()
  const {appState, userState, taskState} = useAppSelector((state) => state)

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
        BigInt(10 ** Number(18) * Number(data.toValue.amount)),
      ).send({from: userState.address})
      
      dispatch(updateTask({
        task: {...task, status: 2}, 
        id: task.id
      }))

      toast.update(toaster, { render: "Depositing token...", type: "default", isLoading: true});
      
      const createMethod = await swapContract.methods.create(
        appState.web3.utils.keccak256(data._id),
        data.from.address,
        data.toValue.token.deployedAddress,
        BigInt(10 ** Number(18) * Number(data.toValue.amount)),
        appState.web3.utils.keccak256(secretKey),
        false,
      )
      await createMethod.estimateGas({from: userState.address})
      const createReceipt = await createMethod.send({from: userState.address})

      // Save order to database
      await appApi.acceptOder(
        data._id,
        { hashlock: appState.web3.utils.keccak256(secretKey)}
      )
      dispatch(saveInfo({...userState, 
        wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
        balance:fixStringBalance(String(
            await appState.web3.eth.getBalance(userState.address)
        ), 18)})
    )

      toast.update(toaster, { render: "The order was accepted successfully.", type: "success", isLoading: false, autoClose: 1000});
      task = {...task, status: 3, transactionHash: createReceipt.transactionHash}
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
      const tokenContract = getTokenContract(appState.web3, data.toValue.token.deployedAddress)
      const SWAP_ADDRESS_CONTRACT = getAddressOneChainContract(userState.network)
      
      await tokenContract.methods.approve(
        SWAP_ADDRESS_CONTRACT,
        BigInt(10 ** Number(18) * Number(data.toValue.amount)),
      ).send({from: userState.address})

      task = {...task, status: 2}
      dispatch(updateTask({ task, id: task.id}))

      toast.update(toaster, { render: "Buying token...", type: "default", isLoading: true});
      
      const swapMethod = swapContract.methods.acceptTx(data.contractId)

      await swapMethod.estimateGas({from: userState.address})

      const acceptRecepit = await swapMethod.send({from: userState.address})

      await appApi.acceptOder(data._id)
      dispatch(saveInfo({...userState, 
        wallet: await getBalanceAccount(appState.web3, userState, appState.tokens),
        balance:fixStringBalance(String(
            await appState.web3.eth.getBalance(userState.address)
        ), 18)})
      )      
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
    if (data.toValue.token.network !== userState.network) {
      requestChangeNetwork(data.toValue.token.network);
      return;
    }
    if (data.from.address === userState.address) {
      alert("You can't accept your order!")
      return;
    }
    let task: ITask = {
      id: taskState.taskList.length,
      type: "",
      status: 0,
      funcExecute: () => {},
      from: {address: data.from.address, token: data.fromValue.token, amount: data.fromValue.amount},
      to: {address: userState.address, token: data.toValue.token, amount: data.toValue.amount},
      orderID: data._id
    }
    if (data.fromValue.token.network === data.toValue.token.network) {
      task = {...task, type: "ACCEPT", funcExecute: confirmOneChain}
    } else {
      task = {...task, type: "BUYER-DEPOSIT", funcExecute: buyerAccept}
    }
    dispatch(createTask(task));
  }
  
  if (!skeleton ) {
    return (
      <div className="app-order">
        <div className="app-order--info">
          <div className="app-order--info--token">
            <img src={data.toValue.token.image} alt="StarBuck" width={60} />
            <div>
              <p className="quantity">{data.toValue.amount} <span className="symbol">{data.toValue.token.symbol}</span></p>
              
            </div>
          </div>
          <div className="icon-container">
            <SwapOutlined rev={""} className="icon" />
          </div>
          <div className="app-order--info--token">
            <img src={data.fromValue.token.image} alt="Token" width={60} />
            <div>
              <p className="quantity">{data.fromValue.amount} <span className="symbol">{data.fromValue.token.symbol}</span></p>
            </div>
          </div>
        </div>
  
        <div style={{fontSize: '1.2rem', color:'rgba(255,255,255,0.8)', fontWeight: 500}}>
          <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
            <div>
            <p>ID: <span>#{data._id.slice(0,4)}...{data._id.slice(-5)}</span></p>
  
            </div>
            <p>Exchange rate: {(data.toValue.amount / data.fromValue.amount).toFixed(2)}</p>
          </div>
        </div>
  
  
        <Divider style={{ marginTop: 6 , marginBottom: 6, borderColor: '#333' }} />
        
        <div className="app-order--action">
            {
              // data.fromValue.network === data.toValue.network ? <div></div> :
              <div className="app-order--action--time_left">
                <p style={{ color: data.fromValue.token.network === data.toValue.token.network ? '#597ef7' : '#9254de' }}>{
                  data.fromValue.token.network === data.toValue.token.network ?
                  mappingNetwork(data.toValue.token.network) : 
                  mappingNetwork(data.toValue.token.network)?.slice(0, Number(mappingNetwork(data.fromValue.token.network)?.length) -  8) + " - " + mappingNetwork(data.fromValue.token.network)
                }</p>
              </div>
            }
            {
              data.from.address !== userState.address &&
              <div className={`app-order--action--btn`} onClick={() => onClickAccept()}
              >
                Buy
              </div>
            }
        </div>
      </div>
    );
  }
  else {
    return (

    <div className="app-order">
    <div className="app-order--info" style={{marginBottom: 51}}>
      <div className="app-order--info--token">
          <Skeleton.Avatar active size={60} shape={'circle'} style={{backgroundColor: "#273c4f"}} />
        <div>
        </div>
      </div>
      <div className="icon-container" style={{borderColor: "#aaa", position:"relative", bottom: -10}} >
        <SwapOutlined rev={""} className="icon" style={{color: "#aaa"}}/>
      </div>
      <div className="app-order--info--token">
        <Skeleton.Avatar active size={60} shape={'circle'} style={{backgroundColor: "#273c4f"}} />
        <div>
        </div>
      </div>
    </div>

    <div style={{fontSize: '1.2rem', color:'rgba(255,255,255,0.8)', fontWeight: 500}}>
      <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
        {/* <div>
        <p>ID: <span>#{data._id.slice(0,4)}...{data._id.slice(-5)}</span></p>

        </div>
        <p>Exchange rate: {(data.toValue.amount / data.fromValue.amount).toFixed(2)}</p> */}
      </div>
    </div>


    <Divider style={{ marginTop: 6 , marginBottom: 6, borderColor: '#333' }} />
    
    <div className="app-order--action">
        {
          <div className="app-order--action--time_left" style={{height: 26, width:80}}>
          </div>
        }
        {
         
          <div className={`app-order--action--btn`}>
            Buy
          </div>
        }
    </div>
  </div>
    )
  }
};

export default Order;
