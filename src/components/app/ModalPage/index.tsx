import { Modal, Result, Steps } from 'antd'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import { clearModal } from '../../../state/modal/modalSlice'
import { useNavigate } from 'react-router-dom'
import './ModalPage.scss'
import { LoadingOutlined, RightSquareTwoTone } from '@ant-design/icons'
import { mappingNetwork } from '../../../utils/blockchain'
import { closeTaskModel } from '../../../state/task/taskSlice'

const ModalPage = () => {
    // const modalState = useAppSelector(state => state.modalState
    const taskState = useAppSelector(state => state.taskState)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    
    
    if (taskState.openModalTask === -1) return <></>
    const task = taskState.taskList[taskState.openModalTask]
    
    if (task.type === "TRANSFER"){
        return (
            <Modal
            title="Transfer Token"
            open={true}
            
            onOk={() => {dispatch(closeTaskModel())}}
            okText= {'OK'}

            cancelText="Cancel"
            onCancel={() => {dispatch(closeTaskModel())}}
            width={700}

            style={{top: 200}}
            closable={true}
        >
            <Steps
                size="default"
                style={{width: 400, margin: 'auto', marginTop: 20, marginBottom: 20}}
                items={[
                    {
                        title: 'Send Token',
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
                <img src={task.token.image} alt='token' style={{height: 60, marginRight: 16}}/>
                <div>
                    <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{task.token.name}</p>
                    <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{task.amount} {task.token.symbol}</p>
                </div>

                <RightSquareTwoTone rev={""} style={{fontSize: '3rem', marginLeft: 20}}/>
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
                    <span style={{fontWeight: 400}}> {task.recipient}</span>
                </p>
                <p>Network: 
                    <span style={{fontWeight: 400}}> {mappingNetwork(task.token.network)}</span>
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
    else return <></>

}

export default ModalPage