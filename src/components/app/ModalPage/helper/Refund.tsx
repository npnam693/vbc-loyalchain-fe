import React from 'react'
import { ITask, ITaskState } from '../../../../state/task/taskSlice'
import { Modal, Steps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { mappingNetwork } from '../../../../utils/blockchain'
import PairToken from '../../PairToken'


export interface IModalElement {
    task: ITask;
    taskState: ITaskState;
    afterClose: () => void;
}

const ModalRefund = ({task, taskState, afterClose} : IModalElement) => {
  return (
      <Modal
        title="Refund Order"
        open={true}
        onOk={() => task.status === 0 ? task.funcExecute(taskState, task.id) : (task.status === 3 ? afterClose : () => {})}
        okText= {(task.status === 0 || task.status === 3) ? "Confirm" : <LoadingOutlined  rev={""}/>}
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

        <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 30}}>
            <div >
              <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{task.from.token.name}</p>
              <p style={{textAlign: "right", fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{task.from.amount} {task.from.token.symbol}</p>
            </div>
            <PairToken from_img={task.from.token.image} to_img={task.to?.token.image} width={60}/>
            <div>
                <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{task.to?.token.name}</p>
                <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{task.to?.amount} {task.to?.token.symbol}</p>
            </div>
        </div>

        <div style={{fontWeight: 500}}>
              <p>Status: {
                  task.status === 0  ? 
                      <span style={{fontWeight: 400, color: "#333"}}>Pending</span> 
                  : (task.status === 3 ? 
                      <span style={{fontWeight: 400, color: "#52c41a"}}>Success</span> 
                  : 
                      <span style={{fontWeight: 400, color: '#1677ff'}}>In Progress</span>)}
              </p>
              <p>Owner: <span>{task.from.address}</span></p>
              
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
                  <span style={{fontWeight: 400}}> {
                      task.status === 0 ? '...' :
                      (task.status === 3 ? task.transactionHash : '...')
                  }</span>
              </p>
          </div>
    </Modal>

  )
}

export default ModalRefund