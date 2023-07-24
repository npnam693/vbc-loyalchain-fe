import { SwapOutlined } from "@ant-design/icons";
import { Divider,} from "antd";
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


interface IOrderItemProps {
  data: any
}

const Order = ({data} : IOrderItemProps) => {
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
      
      const createRecepit = await swapContract.methods.create(
        appState.web3.utils.keccak256(data._id),
        data.from.address,
        data.toValue.token.deployedAddress,
        BigInt(10 ** Number(18) * Number(data.toValue.amount)),
        appState.web3.utils.keccak256(secretKey),
        false,
      ).send({from: userState.address})

      // Save order to database
      await appApi.acceptOder(
        data._id,
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
    console.log(data)
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
                mappingNetwork(data.toValue.token.network)?.slice(0, Number(mappingNetwork(data.fromValue.token.network)?.length) -  8) + " - " + mappingNetwork(data.toValue.token.network)
              }</p>
            </div>
          }
          <div className={`app-order--action--btn`} onClick={() => onClickAccept()}
          >
            Buy
          </div>
      </div>

      {/* <Modal
          title="Accept Order"
          open={openModal}
          
          onOk={onOkModal}
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
                    title: data.fromValue.token.network === data.toValue.token.network ? "Send Token" : "Deposit Token",
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
                    title: data.fromValue.token.network === data.toValue.token.network ? "Send Token" : "Deposit Token",
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
              <div>
                  <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{data.toValue.token.name}</p>
                  <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{data.toValue.amount} {data.toValue.token.symbol}</p>
              </div>
              <PairToken from_img={data.toValue.token.image} to_img={data.fromValue.token.image} width={60}/>
              <div >
                <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{data.fromValue.token.name}</p>
                <p style={{textAlign: "right", fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{data.fromValue.amount} {data.fromValue.token.symbol}</p>
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
              <p>Owner: <span>{data.from.address}</span></p>
              
              <p>Network: 
                  <span style={{fontWeight: 400}}> {
                    data.fromValue.token.network === data.toValue.token.network ?
                      mappingNetwork(data.fromValue.token.network)
                    : mappingNetwork(data.fromValue.token.network) + ' - ' + mappingNetwork(data.toValue.token.network)  
                  }
                  </span>
              </p>
              <p>Order ID:  
                  <span style={{fontWeight: 400}}> {
                      data._id
                  }</span>
              </p>
              <p>Transaction Hash:  
                  <span style={{fontWeight: 400}}> {
                      idTask === -1 ? '...' :
                      (getTask(idTask).status === 3 ? getTask(idTask).transactionHash : '...')
                  }</span>
              </p>
          </div>
      </Modal> */}
    </div>
  );
};

export default Order;
