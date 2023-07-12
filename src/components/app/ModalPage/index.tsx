import { Modal, Result, Steps } from 'antd'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import { clearModal } from '../../../state/modal/modalSlice'
import { useNavigate } from 'react-router-dom'
import './ModalPage.scss'
import { LoadingOutlined } from '@ant-design/icons'

const ModalPage = () => {
    // const modalState = useAppSelector(state => state.modalState

    const taskState = useAppSelector(state => state.taskState)
    
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const task = taskState.taskList[taskState.openModalTask]
    
    return <></>
    // if (task.type === "TRANSFER") {
    //     return (
    //         <Modal
    //             title="Transfer Token"
    //             open={taskState.openModalTask !== -1}
    //             onOk={() => dispatch(clearModal())}
    //             width={700}
    //             style={{top: 200}}
    //             cancelText="Go Wallet"
    //             onCancel={() => {
    //                 navigate("/wallet")
    //                 dispatch(clearModal())
    //             }}
    //         >
    //             <Steps
    //                 size="default"
    //                 style={{width: 600, margin: 'auto', marginTop: 20, marginBottom: 20}}
    //                 items={[
    //                     {
    //                         title: 'Send Token',
    //                         status: 'wait',
    //                         icon: <LoadingOutlined  rev={""}/>,
    //                     },
    //                     {
    //                         title: 'Done',
    //                         status: 'wait',
    //                     },
    //                 ]}
    //         />
    //         </Modal>
    //     )
    // }
    // // else if (task.type === "CREATE") {

    // // }
    // // else if (task.type === "ACCEPT") {

    // // } 
    // else return <></>

        







    // return (
    //     <Modal
    //         title={modalState.titleModal}
    //         open={modalState.open}
    //         onOk={() => dispatch(clearModal())}
    //         width={700}
    //         style={{
    //         top: 200,
    //         }}
    //         cancelText="Go Wallet"
    //         onCancel={() => {
    //             navigate("/wallet")
    //             dispatch(clearModal())
    //         }}
    //     >
    //         {/* <Result
    //             status="success"
    //             title="Successfully Update Order to Marketplace"
    //             subTitle="Order number: 2017182818828182881"
    //             extra={[
    //                 <>
    //                 <p>Swap: 100SAP for 20SBP</p>
    //                 <p>Transaction hash: </p>
    //                 <p>Time created: </p>
    //                 </>
    //             ]}
    //         />
    //          */}
    //         <Result
    //             status={modalState.status}
    //             title={modalState.title}
    //             subTitle={modalState.subtitle}
    //             extra={[
    //                 modalState.content
    //             ]}
    //         />
    //     </Modal>
    // )
}

export default ModalPage