import { SwapOutlined } from "@ant-design/icons";
import { Divider } from "antd";

import "./Order.scss";
import Starbuck from "../../../assets/svg/tokens/starbuck.svg";

const Order = () => {
  return (
    <div className="app-order">
      <div className="app-order--info">
        <div className="app-order--info--token">
          <img src={Starbuck} alt="StarBuck" />
          <div>
            <p className="quantity">30.000</p>
            <p className="symbol">SBP</p>
          </div>
        </div>

        <div className="icon-container">
          <SwapOutlined rev={""} className="icon" />
        </div>

        <div className="app-order--info--token">
          <img src={Starbuck} alt="StarBuck" />
          <div>
            <p className="quantity">30.000</p>
            <p className="symbol">SBP</p>
          </div>
        </div>
      </div>

      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      <div className="app-order--action">
        <div className="app-order--action--time_left">3h 50m 2s left</div>

        <div className="app-order--action--btn">Buy</div>
      </div>
    </div>
  );
};

export default Order;
