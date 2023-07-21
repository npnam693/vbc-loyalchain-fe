import { useEffect, useState } from 'react';
import { IModalElement } from './Transfer';
import { Button, Divider, Input, Modal, Steps } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import PairToken from '../../PairToken';
import { mappingNetwork } from '../../../../utils/blockchain';




const ModalBuyerAccept = ({task, taskState, afterClose} : IModalElement) => {
  const [secret, setSecret] = useState(Array(5).fill(0).map(() => Math.floor(Math.random() * 10)).join("") )
  const generateSecret = () => {
    setSecret(Array(6).fill(0).map(() => Math.floor(Math.random() * 10)).join(""))
  }
  const [showPassWord, setShowPassword] = useState(true)

  useEffect(() => {
    if(status !== 0) {
      showPassWord && setShowPassword(false)
    }
  }, [])
  let status : Number = 0;
  return (
    <Modal
      title="Accept Order"
      open={true}
      onOk={() => task.status === 0 ? task.funcExecute(taskState, task.id, secret) : {}}
      okText= {(task.status === 0 || task.status === 3) ? "Confirm" : <LoadingOutlined  rev={""}/>}
      afterClose={afterClose}
      onCancel={afterClose}
      width={800}
      style={{top: 200}}
      closable={true}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Steps
        size="default"
        style={{width: 700, margin: 'auto', marginTop: 40, marginBottom: 30}}
        items={
          task.status === 0 ? 
          [
            {
              title: "Create key", 
              status: "process"
            },
            {
              title: "Approve Token",
              status: "wait"
            },
            {
              title: "Deposit Token",
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
              status: task.status === -1 ? 'error' : 
                      ((task.status >  1) ? 'finish' : 'process'),
              icon:  task.status === 1 && <LoadingOutlined  rev={""}/>
            },
            {
              title: "Deposit Token",
              status: task.status === -2 ? 'error' : (
                        task.status < 2 ? 'wait' : (
                          task.status === 3 ? 'finish' : 'process'
                        )
                      ),
              icon:  task.status === 2 && <LoadingOutlined  rev={""}/>                  
            },
            {
              title: 'Done',
              status: task.status === 3 ? 'finish' : 'wait'
            }
        ]}
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
          minLength={6} status={secret.length < 6 ? 'error' : ''}
          onChange={(e) => setSecret(e.target.value)}
          visibilityToggle={
            status === 0 ?
            { visible:  showPassWord , onVisibleChange: setShowPassword }
            : false
          }
          
        />
        <Button size='small' style={{fontSize: '1.0rem', marginLeft: 6, borderRadius: 2}}
          onClick={generateSecret}
        >Generate</Button>
      </div>
        {
          secret.length < 6 &&
          <span style={{fontSize: '1.0rem'}}>Minimum 6 characters required for the Secret Key</span>
        }
      <p style={{width:'80%', fontSize:'1.2rem'}}><span style={{color: "orange"}}>Note:</span> Please note that the password you create will be used to secure the contract.
        Kindly remember it carefully to avoid any potential loss of assets.</p>
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

export default ModalBuyerAccept