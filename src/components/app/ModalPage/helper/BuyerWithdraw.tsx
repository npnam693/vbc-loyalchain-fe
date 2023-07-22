import React, { useState } from 'react'
import { ITask, ITaskState } from '../../../../state/task/taskSlice'
import { Divider, Input, Modal, Steps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { mappingNetwork } from '../../../../utils/blockchain'
import PairToken from '../../PairToken'
import { useAppSelector } from '../../../../state/hooks'

export interface IModalElement {
    task: ITask;
    taskState: ITaskState;
    afterClose: () => void;
}

const ModalBuyerWithdraw = ({task, taskState, afterClose} : IModalElement) => {
  const [secret, setSecret] = useState('');
  return (
    <Modal
        title="Withdraw Token"
        open={true}
        onOk={() => task.status === 0 ? task.funcExecute(taskState, task.id, secret) : {}}
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
        style={{width: 600, margin: 'auto', marginTop: 20, marginBottom: 20}}
        items={
            task.status === 0 ? 
            [
              {
                title: "Enter key", 
                status: "process"
              },
              {
                title: "Withdraw Token",
                status: "wait"
              },
              {
                title: "Done",
                status: "wait"
              }
            ] : (
            task.status === 1 ? 
            [
                {
                    title: "Enter key", 
                    status: "finish"
                },
                {
                    title: "Withdraw Token",
                    status: "process",
                    icon: <LoadingOutlined  rev={""}/>
                },
                {
                    title: "Done",
                    status: "wait"
                } 
            ]
            : (
            task.status === 3 ?
            [
              {
                  title: "Enter key", 
                  status: "finish"
              },
              {
                  title: "Withdraw Token",
                  status: "finish",
              },
              {
                  title: "Done",
                  status: "finish"
              } 
            ] : 
            [
              {
                title: "Enter key", 
                status: "finish"
              },
              {
                  title: "Withdraw Token",
                  status: "error",
              },
              {
                  title: "Done",
                  status: "wait"
              } 
            ]))
        }
    />
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30}}>
        <div>
          <p style={{ fontSize: "1.6rem", fontWeight: 500, lineHeight: "1.6rem"}}>
            {task.to?.token.name}
          </p>
          <p style={{textAlign: "right"}}>{mappingNetwork(task.to?.token.network)}</p>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--color-secondary)", textAlign: "right"}}>
            {task.to?.amount} {task.to?.token.symbol}
          </p>
        </div>
        <PairToken
          from_img={task.to?.token.image}
          to_img={task.from?.token.image}
          width={60}
        />
        <div>
          <p
            style={{ fontSize: "1.6rem", fontWeight: 500, lineHeight: "1.6rem",}}
          >
            {task.from.token.name}
          </p>
          <p>{mappingNetwork(task.from.token.network)}</p>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--color-secondary)",
            }}
          >
            {task.from.amount} {task.from.token.symbol}
          </p>
        </div>
      </div>
      <div style={{fontWeight: 600, display:'flex', flexDirection:'row', alignItems:'center'}}>
        Secret Key: 
        <Input.Password value={secret} style={{width: 160, marginLeft: 10}} hidden={true}  
          minLength={6} 
          onChange={(e) => setSecret(e.target.value)}
          visibilityToggle={true}
        />
      </div>
      <p style={{width:'80%', fontSize:'1.2rem'}}><span style={{color: "orange"}}>Note: </span>Your secret key must match the one used when creating the contract to enable withdrawal</p>
      <Divider style={{margin: '10px'}} />

      <div style={{ fontWeight: 500 }}>
        <p>
          Status:{" "}
          {task.status === 0 ? (
            <span style={{ fontWeight: 400, color: "#333" }}>Pending</span>
          ) : task.status === 3 ? (
            <span style={{ fontWeight: 400, color: "#52c41a" }}>
              Success
            </span>
          ) : (
            <span style={{ fontWeight: 400, color: "#1677ff" }}>
              In Progress
            </span>
          )}
        </p>
        <p>
          Transaction Hash:
          <span style={{ fontWeight: 400 }}>
            {" "}
            {task.status === 0
              ? "..."
              : task.status === 3
              ? task.transactionHash
              : "..."}
          </span>
        </p>
        <p>
          Order ID: 
          <span style={{ fontWeight: 400 }}> {task.orderID}</span>
        </p>
        <p>Recipient: 
          <span style={{fontWeight: 400}}> {task.from.address}</span>
        </p>
      </div>
</Modal>
  )
}

export default ModalBuyerWithdraw