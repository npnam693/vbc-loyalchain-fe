import React from 'react'
import { IModalElement } from './Transfer';

const ModalCreate = ({task, taskState, afterClose} : IModalElement) => {
  return (
    {openModal && isOneChain && (
        <Modal
          title="Create Order"
          open={openModal}
          onOk={
            idTask === -1
              ? createOrderOneChain
              : () => {
                  setOpenModal(false);
                  setIdTask(-1);
                }
          }
          okText={idTask === -1 ? "Confirm" : "OK"}
          cancelText="Cancel"
          onCancel={() => {
            setOpenModal(false);
            setIdTask(-1);
          }}
          width={700}
          style={{ top: 200 }}
          closable={true}
        >
          <Steps
            size="default"
            style={{
              width: 600,
              margin: "auto",
              marginTop: 40,
              marginBottom: 30,
            }}
            items=
            {
              idTask === -1 ? 
              [
                {
                  title: "Approve Token",
                  status: "wait",
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
                      getTask(idTask).status === -1
                        ? "error"
                        : getTask(idTask).status > 1
                        ? "finish"
                        : "process",
                    icon: getTask(idTask).status === 1 && (
                      <LoadingOutlined rev={""} />
                    ),
                  },
                  {
                    title: "Send Token",
                    status:
                      getTask(idTask).status === -2
                        ? "error"
                        : getTask(idTask).status < 2
                        ? "wait"
                        : getTask(idTask).status === 3
                        ? "finish"
                        : "process",
                    icon: getTask(idTask).status === 2 && (
                      <LoadingOutlined rev={""} />
                    ),
                  },
                  {
                    title: "Done",
                    status: getTask(idTask).status === 3 ? "finish" : "wait",
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
                {formData.from.token.name}
              </p>
              <p
                style={{
                  textAlign: "right",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                }}
              >
                {formData.from.amount} {formData.from.token.symbol}
              </p>
            </div>
            <PairToken
              from_img={formData.from.token.image}
              to_img={formData.to.token.image}
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
                {formData.to.token.name}
              </p>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                }}
              >
                {formData.to.amount} {formData.to.token.symbol}
              </p>
            </div>
          </div>

          <div style={{ fontWeight: 500 }}>
            <p>
              Status:{" "}
              {idTask === -1 ? (
                <span style={{ fontWeight: 400, color: "#333" }}>Pending</span>
              ) : getTask(idTask).status === 3 ? (
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
                {formData.from.token.network === formData.to.token.network
                  ? mappingNetwork(formData.from.token.network)
                  : mappingNetwork(formData.from.token.network) +
                    " - " +
                    mappingNetwork(formData.to.token.network)}
              </span>
            </p>
            <p>
              Transaction Hash:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {idTask === -1
                  ? "..."
                  : getTask(idTask).status === 3
                  ? getTask(idTask).transactionHash
                  : "..."}
              </span>
            </p>
            <p>
              Order ID:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {idTask === -1
                  ? "..."
                  : getTask(idTask).status === 3
                  ? getTask(idTask).orderID
                  : "..."}
              </span>
            </p>
          </div>
        </Modal>
      )}
      {openModal && !isOneChain && (
        <Modal
          title="Create Order"
          open={openModal}
          onOk={
            idTask === -1
              ? createOrderTwoChain
              : () => {
                  setOpenModal(false);
                  setIdTask(-1);
                }
          }
          okText={idTask === -1 ? "Confirm" : "OK"}
          cancelText="Cancel"
          onCancel={() => {
            setOpenModal(false);
            setIdTask(-1);
          }}
          width={700}
          style={{ top: 200 }}
          closable={true}
        >
          <Steps
            size="default"
            style={{
              width: 600,
              margin: "auto",
              marginTop: 40,
              marginBottom: 30,
            }}
            items=
            {
              idTask === -1 ? 
              [
                {
                  title: "Check balance",
                  status: "wait",
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
                      getTask(idTask).status === -1
                        ? "error"
                        : getTask(idTask).status > 1
                        ? "finish"
                        : "process",
                    icon: getTask(idTask).status === 1 && (
                      <LoadingOutlined rev={""} />
                    ),
                  },
                  {
                    title: "Save Order",
                    status:
                      getTask(idTask).status === -2
                        ? "error"
                        : getTask(idTask).status < 2
                        ? "wait"
                        : getTask(idTask).status === 3
                        ? "finish"
                        : "process",
                    icon: getTask(idTask).status === 2 && (
                      <LoadingOutlined rev={""} />
                    ),
                  },
                  {
                    title: "Done",
                    status: getTask(idTask).status === 3 ? "finish" : "wait",
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
                {formData.from.token.name}
              </p>
              <p
                style={{
                  textAlign: "right",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                }}
              >
                {formData.from.amount} {formData.from.token.symbol}
              </p>
            </div>
            <PairToken
              from_img={formData.from.token.image}
              to_img={formData.to.token.image}
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
                {formData.to.token.name}
              </p>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                }}
              >
                {formData.to.amount} {formData.to.token.symbol}
              </p>
            </div>
          </div>

          <div style={{ fontWeight: 500 }}>
            <p>
              Status:{" "}
              {idTask === -1 ? (
                <span style={{ fontWeight: 400, color: "#333" }}>Pending</span>
              ) : getTask(idTask).status === 3 ? (
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
                {formData.from.token.network === formData.to.token.network
                  ? mappingNetwork(formData.from.token.network)
                  : mappingNetwork(formData.from.token.network) +
                    " - " +
                    mappingNetwork(formData.to.token.network)}
              </span>
            </p>
            <p>
              Transaction Hash:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {idTask === -1
                  ? "..."
                  : getTask(idTask).status === 3
                  ? getTask(idTask).transactionHash
                  : "..."}
              </span>
            </p>
            <p>
              Order ID:
              <span style={{ fontWeight: 400 }}>
                {" "}
                {idTask === -1
                  ? "..."
                  : getTask(idTask).status === 3
                  ? getTask(idTask).orderID
                  : "..."}
              </span>
            </p>
          </div>
        </Modal>
      )}  )
}

export default ModalCreate