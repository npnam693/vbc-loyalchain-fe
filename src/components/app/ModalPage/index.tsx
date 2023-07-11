import { Modal, Result } from 'antd'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import { clearModal } from '../../../state/modal/modalSlice'
import { useNavigate } from 'react-router-dom'
import './ModalPage.scss'

const ModalPage = () => {
    const modalState = useAppSelector(state => state.modalState)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    return (
        <Modal
            title={modalState.titleModal}
            open={modalState.open}
            onOk={() => dispatch(clearModal())}
            width={700}
            style={{
            top: 200,
            }}
            cancelText="Go Wallet"
            onCancel={() => {
                navigate("/wallet")
                dispatch(clearModal())
            }}
        >
            {/* <Result
                status="success"
                title="Successfully Update Order to Marketplace"
                subTitle="Order number: 2017182818828182881"
                extra={[
                    <>
                    <p>Swap: 100SAP for 20SBP</p>
                    <p>Transaction hash: </p>
                    <p>Time created: </p>
                    </>
                ]}
            />
             */}
            <Result
                status={modalState.status}
                title={modalState.title}
                subTitle={modalState.subtitle}
                extra={[
                    modalState.content
                ]}
            />
        </Modal>
    )
}

export default ModalPage