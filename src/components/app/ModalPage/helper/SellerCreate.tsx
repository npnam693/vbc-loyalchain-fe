import React from 'react'
import { ITask, ITaskState } from '../../../../state/task/taskSlice';
import { Modal, Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PairToken from '../../PairToken';
import { mappingNetwork } from '../../../../utils/blockchain';

export interface IModalElement {
    task: ITask;
    taskState: ITaskState;
    afterClose: () => void;
}

const ModalSellerCreate = ({task, taskState, afterClose} : IModalElement) => {
  return (
    <Modal
      title="Create Order"
      open={true}
      onOk={() => task.status === 0 ? task.funcExecute(taskState, task.id) : (task.status === 3 ? afterClose() : {})}
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
        style={{ width: 600, margin: "auto", marginTop: 40, marginBottom: 30}}
        items= {
            task.status === 0 ?
            [
                {
                  title: "Check balance",
                  status: "process",
                },
                {
                  title: "Save Order",
                  status: "wait",
                },
                {
                  title: "Done",
                  status: "wait",
                },
            ]
            : [
                  {
                    title: "Check balance",
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
                    title: "Save Order",
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
          Order ID: 
          <span style={{ fontWeight: 400 }}> {task.orderID}</span>
        </p>
      </div>
    </Modal>
  )
}

export default ModalSellerCreate