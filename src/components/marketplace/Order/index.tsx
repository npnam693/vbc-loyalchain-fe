import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
import { Divider, Modal, Steps } from "antd";
import { toast } from "react-toastify";
import { useState } from "react";

import "./Order.scss";
import appApi from "../../../api/appAPI";
import PairToken from "../../app/PairToken";
import { useAppSelector } from "../../../state/hooks";
import { useAppDispatch } from "../../../state/hooks";
import { saveInfo } from "../../../state/user/userSlice";
import { IAcceptTask, createTask, updateTask } from "../../../state/task/taskSlice";
import { getSwapOneContract, getTokenContract } from "../../../services/contract";
import { getAddressOneChainContract, getBalanceAccount, mappingNetwork } from "../../../utils/blockchain";

const Order = (props : any) => {
  const dispatch = useAppDispatch()
  const web3State = useAppSelector((state) => state.appState.web3)
  const tokenState = useAppSelector((state) => state.appState.tokens)
  const userState = useAppSelector((state) => state.userState)
  const taskState = useAppSelector((state) => state.taskState)

  const [idTask, setIdTask] = useState(-1);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const getTask : any = (id : number) => {
    return taskState.taskList[taskState.taskList.length - 1 - id]
  }
  
  
  const onConfirmAccept = async () => {
    let acceptTask : IAcceptTask = {
      id: taskState.taskList.length,
      type: "ACCEPT",
      status: 1,
      tokenFrom: props.data.fromValue.token,
      tokenTo: props.data.toValue.token,
      amountFrom: props.data.fromValue.amount,
      amountTo: props.data.toValue.amount,
      orderID: props.data._id,
      owner: props.data.from.address
    }
    const toaster = toast.loading("Approving token...")
    dispatch(createTask(acceptTask))
    setIdTask(acceptTask.id)
    try {
      const exchangeContract = getSwapOneContract(web3State, userState.network);
      const tokenContract = getTokenContract(web3State, props.data.toValue.token.deployedAddress)
      const SWAP_ADDRESS_CONTRACT = getAddressOneChainContract(userState.network)
      
      const approveRecipt = await tokenContract.methods.approve(
        SWAP_ADDRESS_CONTRACT,
        BigInt(10 ** Number(18) * Number(props.data.toValue.amount)),
      ).send({from: userState.address})

      acceptTask = {...acceptTask, status: 2}
      dispatch(updateTask({
        task: acceptTask, 
        id: acceptTask.id
      }))

      toast.update(toaster, { render: "Buying token...", type: "default", isLoading: true});
      const acceptExchangeMethod = exchangeContract.methods.acceptTx(
        props.data.txIdFrom,
      )
      const exchangeRecepit = await web3State.eth.sendTransaction({
        from: userState.address,
        gasPrice: "0",
        gas: await acceptExchangeMethod.estimateGas({
          from: userState.address,
          data: acceptExchangeMethod.encodeABI()
        }),
        to: SWAP_ADDRESS_CONTRACT,
        value: "0",
        data: acceptExchangeMethod.encodeABI(),
      })

      const orderData = await appApi.acceptOder(props.data._id, props.data.txIdFrom )
      
      dispatch(saveInfo({...userState, wallet: await getBalanceAccount(web3State, userState, tokenState)}))
      
      toast.update(toaster, { render: "The order was accepted successfully.", type: "success", isLoading: false, autoClose: 1000});
      
      acceptTask = {...acceptTask, status: 3, transactionHash: exchangeRecepit.blockHash}
      dispatch(updateTask({
        task: acceptTask, 
        id: acceptTask.id
      }))

    } catch (error) {
      console.log(error);
      dispatch(updateTask({
        task: {
            ...acceptTask, 
            status: acceptTask.status === 1 ? -1 : -2 ,
        }, 
        id: acceptTask.id
      }))
      toast.update(toaster, { render: "Accept order fail, see detail in console!", type: "error", isLoading: false, autoClose: 1000});
    }
  }

  return (
    <div className="app-order" style={{marginBottom: 20}}>
      <div className="app-order--info">
        <div className="app-order--info--token">
          <img src={props.data.toValue.token.image} alt="StarBuck" width={60} />
          <div>
            <p className="quantity">{props.data.toValue.amount} <span className="symbol">{props.data.toValue.token.symbol}</span></p>
            
          </div>
        </div>
      
        <div className="icon-container">
          <SwapOutlined rev={""} className="icon" />
        </div>
        <div className="app-order--info--token">
          <img src={props.data.fromValue.token.image} alt="Token" width={60} />
          <div>
            <p className="quantity">{props.data.fromValue.amount} <span className="symbol">{props.data.fromValue.token.symbol}</span></p>
          </div>
        </div>
      </div>

      <div style={{fontSize: '1.2rem', color:'rgba(255,255,255,0.8)', fontWeight: 500}}>
        <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
          <p>ID: <span>#{props.data._id.slice(0,4)}...{props.data._id.slice(-5)}</span></p>
          <p>MBC Network</p>
          </div>
          <p>Exchange rate: 0.01</p>
        </div>
      </div>


      <Divider style={{ marginTop: 6 , marginBottom: 6, borderColor: '#333' }} />
      
      <div className="app-order--action">
          {
            props.data.fromValue.network === props.data.toValue.network ? <div></div> :
            <div className="app-order--action--time_left">3h 50m 2s left</div>
          }
          <div className="app-order--action--btn" onClick={() => setOpenModal(true)}>Buy</div>
      </div>

      <Modal
          title="Accept Order"
          open={openModal}
          
          onOk={idTask === -1 ? onConfirmAccept : () => {setOpenModal(false) ; setIdTask(-1)}}
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
              <div>
                  <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{props.data.toValue.token.name}</p>
                  <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{props.data.toValue.amount} {props.data.toValue.token.symbol}</p>
              </div>
              <PairToken from_img={props.data.toValue.token.image} to_img={props.data.fromValue.token.image} width={60}/>
              <div >
                <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{props.data.fromValue.token.name}</p>
                <p style={{textAlign: "right", fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{props.data.fromValue.amount} {props.data.fromValue.token.symbol}</p>
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
              <p>Owner: <span>{props.data.from.address}</span></p>
              
              <p>Network: 
                  <span style={{fontWeight: 400}}> {
                    props.data.fromValue.token.network === props.data.toValue.token.network ?
                      mappingNetwork(props.data.fromValue.token.network)
                    : mappingNetwork(props.data.fromValue.token.network) + ' - ' + mappingNetwork(props.data.toValue.token.network)  
                  }
                  </span>
              </p>
              <p>Order ID:  
                  <span style={{fontWeight: 400}}> {
                      props.data._id
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

export default Order;
