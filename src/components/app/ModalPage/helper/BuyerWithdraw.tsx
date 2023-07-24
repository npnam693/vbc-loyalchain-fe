import React, { useState } from 'react'
import { ITask, ITaskState } from '../../../../state/task/taskSlice'
import { Divider, Input, Modal, Steps, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getLinkExplore, mappingNetwork } from '../../../../utils/blockchain'
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
        onOk={() => task.status === 0 ? task.funcExecute(taskState, task.id, secret) : 
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
            ] : (
            task.status === -1 ?
            [
              {
                title: "Enter key", 
                status: "error"
              },
              {
                  title: "Withdraw Token",
                  status: "wait",
              },
              {
                  title: "Done",
                  status: "wait"
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
            ])))
        }
    />
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30}}>
      <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 16}}>
        <img src={task.to?.token.image} alt='token' style={{height: 60, marginRight: 16}}/>
        <div style={{display:'flex', flexDirection:'column'}}>
            <p style={{fontSize: '1.6rem', fontWeight: 500, lineHeight: '1.6rem'}}>{task.to?.token.name}</p>
            <span style={{fontWeight: 400, fontSize:"1.2rem", lineHeight:'1.2rem', margin: 0}}> {mappingNetwork(task.from.token.network)}</span>
            <p style={{fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-secondary)'}}>{task.to?.amount} {task.to?.token.symbol}</p>
        </div>
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

export default ModalBuyerWithdraw