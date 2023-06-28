import React from "react";
import "./CreateOrder.scss";
import SBP from "../../assets/svg/tokens/starbuck.svg";
import { DownOutlined, SwapOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function CreateOrder() {
  return (
    <div className="app-create">
      <p className="title">Swap</p>
      <p className="title--desc">Easy way to exchange your loyalty points</p>

      <div className="content">
        <div className="form">
          <div className="form-input">
            <div className="form-input--header">
              <p>From</p>
              <div>
                <img src={SBP} alt="Token" />
                <p>SBP</p>
                <DownOutlined rev="" />
              </div>
            </div>

            <div className="form-input--content">
              <input />

              <div>
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
              <div>
                <img src={SBP} alt="Token" />
                <p>SBP</p>
                <DownOutlined rev="" />
              </div>
            </div>

            <div className="form-input--content">
              <input />

              <div>
                <Button>MAX</Button>
                <p>Available: 500</p>
              </div>
            </div>
          </div>
        </div>

        <div className="ìnfo"></div>
      </div>
    </div>
  );
}
