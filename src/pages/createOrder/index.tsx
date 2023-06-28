import React, { useState } from "react";
import "./CreateOrder.scss";
import SBP from "../../assets/svg/tokens/starbuck.svg";
import { DownOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Divider, InputNumber } from "antd";
import PairToken from "../../components/app/PairToken";

export default function CreateOrder() {
  const [formData, setFormData] = useState({
    from: "",
    from_amount: 0,
    to: "",
    to_amount: 0,
    timelock: 0,
  });

  const hdClickMaxBalance = () => {};
  const hdClickSwap = () => {};
  const hdClick = () => {};

  return (
    <div className="app-create">
      <p className="title">Swap</p>
      <p className="title--desc">Easy way to exchange your loyalty points</p>

      <div className="content">
        <div className="form">
          <div className="form-input">
            <div className="form-input--header">
              <p>From</p>
              <div className="form-input--header--token">
                <img src={SBP} alt="Token" />
                <p>SBP</p>
                <DownOutlined rev="" style={{ fontSize: "1.4rem" }} />
              </div>
            </div>

            <div className="form-input--content">
              <InputNumber
                placeholder="0.0"
                className="form-input--content--input"
                style={{ color: "red" }}
              />

              <div className="form-input--content--amount">
                <Button>MAX</Button>
                <p>Available: 500</p>
              </div>
            </div>
          </div>

          <div className="icon-container">
            <SwapOutlined rev={""} className="icon" />
          </div>

          <div className="form-input">
            <div className="form-input--header">
              <p>From</p>
              <div className="form-input--header--token">
                <img src={SBP} alt="Token" />
                <p>SBP</p>
                <DownOutlined rev="" style={{ fontSize: "1.4rem" }} />
              </div>
            </div>

            <div className="form-input--content">
              <InputNumber
                placeholder="0.0"
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
              <InputNumber />
              <p>hours</p>
            </div>
          </div>
        </div>
      </div>

      <Button type="primary">Create</Button>
    </div>
  );
}
