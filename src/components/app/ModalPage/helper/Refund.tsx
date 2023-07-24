import React from 'react'
import { ITask, ITaskState } from '../../../../state/task/taskSlice'
import { Modal, Steps, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getLinkExplore, mappingNetwork } from '../../../../utils/blockchain'
import PairToken from '../../PairToken'
import { useAppSelector } from '../../../../state/hooks'


export interface IModalElement {
    task: ITask;
    taskState: ITaskState;
    afterClose: () => void;
}

const ModalRefund = ({task, taskState, afterClose} : IModalElement) => {
    const {userState} = useAppSelector(state => state)
    console.log(task.from.address === userState.address)
  return (
      <Modal
        title="Refund Order"
        open={true}
        onOk={() => task.status === 0 ? task.funcExecute(taskState, task.id) : 
            ((task.status === 3 || task.status < 0) ? afterClose() : {})}
            okText= {
                task.status === 0 ? "Confirm" : (
                (task.status === 3 || task.status < 0) ? "OK" : <LoadingOutlined  rev={""}/>)}
        afterClose={afterClose}
        onCancel={afterClose}
        width={700}
        style={{top: 200}}
        closable={true}
        cancelButtonProps={{ style: { display: 'none' } }}
    >

        <Steps size="default" style={{width: 600, margin: 'auto', marginTop: 40, marginBottom: 30}}
            items={
                task.status === 0 ? 
                [
                    { title: "Validate transaction", status: "wait"},
                    { title: "Refund Token", status: "wait"},
                    { title: "Done", status: "wait"}
                ] : (
                task.status === 1 ? 
                [
                    { title: "Validate transaction", status: "process", icon: <LoadingOutlined  rev={""}/>},
                    { title: "Refund Token", status: "wait"},
                    { title: "Done", status: "wait"}
                ] : (
                task.status === 2 ? [
                    { title: "Validate transaction", status: "finish"},
                    { title: "Refund Token", status: "process", icon: <LoadingOutlined rev={""} />},
                    { title: "Done", status: "wait"}
                ] : (
                task.status === 3 ? [
                    { title: "Validate transaction", status: "finish"},
                    { title: "Refund Token", status: "finish"},
                    { title: "Done", status: "finish"}
                ] : (
                task.status === -1 ? [
                    { title: "Validate transaction", status: "error"},
                    { title: "Refund Token", status: "wait"},
                    { title: "Done", status: "wait"}
                ] : 
                [
                    { title: "Validate transaction", status: "finish"},
                    { title: "Refund Token", status: "error"},
                    { title: "Done", status: "wait"}
                ]))))}
        />

        {
            userState.address === task.from.address ?
            <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 16}}>
                <img src={task.from.token.image} alt='token' style={{height: 60, marginRight: 16}}/>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{task.from.token.name}</p>
                    <span style={{fontWeight: 400, fontSize:"1.2rem", lineHeight:'1.2rem', margin: 0, marginTop: 5}}> {mappingNetwork(task.from.token.network)}</span>
                    <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{task.from.amount} {task.from.token.symbol}</p>
                </div>
            </div>
            :
            <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 16}}>
                <img src={task.to?.token.image} alt='token' style={{height: 60, marginRight: 16}}/>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{task.to?.token.name}</p>
                    <span style={{fontWeight: 400, fontSize:"1.2rem", lineHeight:'1.2rem', margin: 0, marginTop: 5}}> {mappingNetwork(task.from.token.network)}</span>
                    <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{task.to?.amount} {task.to?.token.symbol}</p>
                </div>
            </div>
        }


        <div style={{fontWeight: 500}}>
              <p>Status: {
                  task.status === 0  ? 
                      <span style={{fontWeight: 400, color: "#333"}}>Pending</span> 
                  : (task.status === 3 ? 
                      <span style={{fontWeight: 400, color: "#52c41a"}}>Success</span> 
                  : 
                      <span style={{fontWeight: 400, color: '#1677ff'}}>In Progress</span>)}
              </p>
              <p>Recipient: <span style={{fontWeight: 400}}>{userState.address === task.from.address ? task.to?.address : task.from.address}</span></p>
              
              <p>Network: 
                  <span style={{fontWeight: 400}}> {
                    task.from.token.network === task.to?.token.network ?
                      mappingNetwork(task.from.token.network)
                    : mappingNetwork(task.from.token.network) + ' - ' + mappingNetwork(task.to?.token.network)  
                  }
                  </span>
              </p>
              <p>Order ID:  
                  <span style={{fontWeight: 400}}> {
                      task.orderID
                  }</span>
              </p>
              <p>Transaction Hash:  
                {
                task.transactionHash && 
                <Tooltip title={(<div style={{cursor:'pointer'}} onClick={() => window.open(getLinkExplore(task.transactionHash, task.to?.token.network), '_blank', 'noopener,noreferrer')}>View in explorer</div>)} placement='bottom'>
                    <span style={{ fontWeight: 400 }}> {" "}
                    { task.transactionHash }
                    </span>
                </Tooltip>
                }
              </p>
          </div>
    </Modal>

  )
}

export default ModalRefund