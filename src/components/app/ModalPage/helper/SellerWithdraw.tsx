import React from 'react'
import { ITask, ITaskState } from '../../../../state/task/taskSlice'
import { Modal, Steps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { mappingNetwork } from '../../../../utils/blockchain'


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
        onOk={() => task.status === 0 ? task.funcExecute(taskState, task.id) : {}}
        okText= {(task.status === 0 || task.status === 3) ? "Confirm" : <LoadingOutlined  rev={""}/>}
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
        <img src={task.from.token.image} alt='token' style={{height: 60, marginRight: 16}}/>
        <div>
            <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{task.from.token.name}</p>
            <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{task.from.amount} {task.from.token.symbol}</p>
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
        <p>To: 
            <span style={{fontWeight: 400}}> {task.to && task.to.address}</span>
        </p>
        <p>Network: 
            <span style={{fontWeight: 400}}> {mappingNetwork(task.from.token.network)}</span>
        </p>
        <p>Transaction Hash:  
            <span style={{fontWeight: 400}}> {
                (task.status === 3 ? task.transactionHash : '...')
            }</span>
        </p>
        <p>Transaction ID:  
            <span style={{fontWeight: 400}}> {
                (task.status === 3 ? task.orderID : '...')
            }</span>
        </p>
    </div>
</Modal>
  )
}

export default ModalSellerWithdraw