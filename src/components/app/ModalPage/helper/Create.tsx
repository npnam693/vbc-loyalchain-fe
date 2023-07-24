import React from 'react'
import { IModalElement } from './Transfer';
import { Modal, Steps, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PairToken from '../../PairToken';
import { getLinkExplore, mappingNetwork } from '../../../../utils/blockchain';

const ModalCreate = ({task, taskState, afterClose} : IModalElement) => {
  return (
    <Modal
      title="Create Order"
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
        style={{ width: 600, margin: "auto", marginTop: 40, marginBottom: 30}}
        items= {
          task.status === 0 ? 
          [
            {
              title: "Approve Token",
              status: "process",
            },
            {
              title: "Send Token",
              status: "wait",
            },
            {
              title: "Done",
              status: "wait",
            },
          ]
          : [
              {
                title: "Approve Token",
                status:
                  task.status === -1
                    ? "error"
                    : task.status > 1
                    ? "finish"
                    : "process",
                icon: task.status === 1 && (
                  <LoadingOutlined rev={""} />
                ),
              },
              {
                title: "Send Token",
                status:
                  task.status === -2
                    ? "error"
                    : task.status < 2
                    ? "wait"
                    : task.status === 3
                    ? "finish"
                    : "process",
                icon: task.status === 2 && (
                  <LoadingOutlined rev={""} />
                ),
              },
              {
                title: "Done",
                status: task.status === 3 ? "finish" : "wait",
              },
            ]
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: 500,
              lineHeight: "1.6rem",
            }}
          >
            {task.from.token.name}
          </p>
          <p
            style={{
              textAlign: "right",
              fontSize: "1.6rem",
              fontWeight: 600,
              color: "var(--color-secondary)",
            }}
          >
            {task.from.amount} {task.from.token.symbol}
          </p>
        </div>
        <PairToken
          from_img={task.from.token.image}
          to_img={task.to?.token.image}
          width={60}
        />
        <div>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: 500,
              lineHeight: "1.6rem",
            }}
          >
            {task.to?.token.name}
          </p>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: 600,
              color: "var(--color-secondary)",
            }}
          >
            {task.to?.amount} {task.to?.token.symbol}
          </p>
        </div>
      </div>

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
          Network:
          <span style={{ fontWeight: 400 }}>
            {" "}
            {task.from.token.network === task.to?.token.network
              ? mappingNetwork(task.from.token.network)
              : mappingNetwork(task.from.token.network) +
                " - " +
                mappingNetwork(task.to?.token.network)}
          </span>
        </p>
        <p>
          Order ID:
          <span style={{ fontWeight: 400 }}>
            {" "}
            {task.status === 0
              ? "..."
              : task.status === 3
              ? task.orderID
              : "..."}
          </span>
        </p>
        <p>
          Transaction Hash: {" "}
          {
            task.transactionHash && 
            <Tooltip title={(<div style={{cursor:'pointer'}} onClick={() => window.open(getLinkExplore(task.transactionHash, task.from.token.network), '_blank', 'noopener,noreferrer')}>View in explorer</div>)} placement='bottom'>
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

export default ModalCreate