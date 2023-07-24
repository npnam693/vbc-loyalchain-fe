import React from 'react'
import { ITask, ITaskState } from '../../../../state/task/taskSlice'
import { Modal, Steps, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getLinkExplore, mappingNetwork } from '../../../../utils/blockchain'


export interface IModalElement {
    task: ITask;
    taskState: ITaskState;
    afterClose: () => void;
}

const ModalSellerWithdraw = ({task, taskState, afterClose} : IModalElement) => {
  return (
    <Modal
        title="Withdraw Token"
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
    <Steps
        size="default"
        style={{width: 400, margin: 'auto', marginTop: 20, marginBottom: 20}}
        items={[
            {
                title: 'Withdraw Token',
                status: task.status === -1 ? 'error' : 
                        (task.status === 3 ? 'finish' : 'process'),
                icon: task.status === 2 && <LoadingOutlined  rev={""}/>,
            },
            {
                title: 'Done',
                status: task.status === 3 ? 'finish' : 'wait'
            }
        ]}
    />
    <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 16}}>
        <img src={task.to?.token.image} alt='token' style={{height: 60, marginRight: 16}}/>
        <div style={{display:'flex', flexDirection:'column'}}>
            <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{task.to?.token.name}</p>
            <span style={{fontWeight: 400, fontSize:"1.2rem", lineHeight:'1.2rem', margin: 0}}> {mappingNetwork(task.to?.token.network)}</span>
            <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{task.to?.amount} {task.to?.token.symbol}</p>
        </div>
    </div>
    
    <div style={{fontWeight: 500}}>
        <p>Status: {
            (task.status === 3 ? 
                <span style={{fontWeight: 400, color: "#52c41a"}}>Success</span> 
            : (
                task.status === -1 ?
                <span style={{fontWeight: 400, color: '#ff4d4f'}}>Failed</span>
                :
                <span style={{fontWeight: 400, color: '#1677ff'}}>In Progress</span>)
            )
            }
        </p>
        <p>Recipient: 
          <span style={{fontWeight: 400}}> {task.from.address}</span>
        </p>
        <p>
          Order ID: 
          <span style={{ fontWeight: 400 }}> {task.orderID}</span>
        </p>
        <p>
          Transaction Hash:{" "}
          {
            task.transactionHash && 
            <Tooltip title={(<div style={{cursor:'pointer'}} onClick={() => window.open(getLinkExplore(task.transactionHash, task.to?.token.network), '_blank', 'noopener,noreferrer')}>View in explorer</div>)} placement='bottom'>
              <span style={{ fontWeight: 400 }}>
              { task.transactionHash }
              </span>
            </Tooltip>
          }
        </p>
    </div>
</Modal>
  )
}

export default ModalSellerWithdraw