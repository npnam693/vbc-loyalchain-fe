import React from "react";
import myimg from "../../../assets/svg/rewards/img1.svg";
import tokenimg from "../../../assets/svg/tokens/starbuck.svg";
import "./RewardItem.scss";
import { Divider, Button } from "antd";

interface IRewardItemProps {
  uriImg: string;
  name: string;
  token: string;
  // uriToken: string,
  all_amount: number;
  amount: number;
  time_left: string;
}

const RewardItem = () => {
  return (
    <div className="app-reward_item">
      <img src={myimg} alt="img" />

      <div className="content">
        <p className="title">ArtStarBuck</p>

        <div className="info">
          <div className="cost">
            <img
              src={tokenimg}
              alt="myIMG"
              style={{ width: "2.5rem", marginRight: 6 }}
            />
            <p>2000 SBP</p>
          </div>

          <div className="quantity">
            <p>10 of 20</p>
          </div>
        </div>

        <Divider className="divider" />

        <div className="action">
          <div className="time-left">3h 50m 2s left</div>

          <Button>Buy</Button>
        </div>
      </div>
    </div>
  );
};

export default RewardItem;
