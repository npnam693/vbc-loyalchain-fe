import React, { useState } from "react";
import "./CreateOrder.scss";
import SBP from "../../assets/svg/tokens/starbuck.svg";
import { DownOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Divider, InputNumber } from "antd";
import PairToken from "../../components/app/PairToken";
import SelectToken from "../../components/app/SelectToken";

interface IFormData {
  from: string;
  from_amount: number;
  to: string;
  to_amount: number;
  timelock: number;
}

export default function CreateOrder() {
  const [formData, setFormData] = useState<IFormData>({
    from: "SBP",
    from_amount: 0,
    to: "WMP",
    to_amount: 10,
    timelock: 0,
  });
  const [selectingToken, setSelectingToken] = useState<boolean>(true);

  const hdClickMaxBalance = () => {};
  const hdClickSwap = () => {
    const newData: IFormData = {
      from: formData.to,
      from_amount: formData.to_amount,
      to: formData.from,
      to_amount: formData.from_amount,
      timelock: formData.timelock,
    };
    setFormData(newData);
  };
  const hdClickCreate = () => {};

  const hdClickSelectToken = () => {
    setSelectingToken(!selectingToken);
  };

  return (
    <div className="app-create">
      <p className="title">Swap</p>
      <p className="title--desc">Easy way to exchange your loyalty points</p>

      <div className="content">
        <div className="form">
          <div className="form-input">
            <div className="form-input--header">
              <p>From</p>
              <div
                className="form-input--header--token"
                onClick={hdClickSelectToken}
              >
                <img src={SBP} alt="Token" />
                <p>{formData.from}</p>
                <DownOutlined rev="" style={{ fontSize: "1.4rem" }} />
              </div>
            </div>

            <div className="form-input--content">
              <InputNumber
                placeholder="0.0"
                min={0}
                value={formData.from_amount}
                onChange={(e) =>
                  setFormData({ ...formData, from_amount: Number(e) })
                }
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button>MAX</Button>
                <p>Available: 500</p>
              </div>
            </div>
          </div>

          <div
            className="icon-container"
            onClick={hdClickSwap}
            style={{ cursor: "pointer" }}
          >
            <SwapOutlined rev={""} className="icon" />
          </div>

          <div className="form-input">
            <div className="form-input--header">
              <p>From</p>
              <div
                className="form-input--header--token"
                onClick={hdClickSelectToken}
              >
                <img src={SBP} alt="Token" />
                <p>{formData.to}</p>
                <DownOutlined rev="" style={{ fontSize: "1.4rem" }} />
              </div>
            </div>

            <div className="form-input--content">
              <InputNumber
                placeholder="0.0"
                min={0}
                value={formData.to_amount}
                onChange={(e) =>
                  setFormData({ ...formData, to_amount: Number(e) })
                }
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button onClick={hdClickMaxBalance}>MAX</Button>
                <p>Available: 500</p>
              </div>
            </div>
          </div>
        </div>

        <Divider type="vertical" className="divider" />

        <div className="info">
          <div className="average">
            <p className="info-title">Average exchange rate</p>
            <div className="pair">
              <PairToken />
              <p className="average">1.005</p>
            </div>
          </div>

          <div className="locktime">
            <p className="info-title">Time Lock</p>
            <div className="input-time">
              <InputNumber min={0} placeholder="24" />
              <p>hours</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="primary"
        onClick={hdClickCreate}
        className="btn-create-order"
      >
        Create
      </Button>

      {selectingToken && (
        <SelectToken closeFunction={() => setSelectingToken(!selectingToken)} />
      )}
    </div>
  );
}
