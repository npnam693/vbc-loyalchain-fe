import React from "react";
import myimg from "../../../assets/svg/rewards/img1.svg";
import tokenimg from "../../../assets/svg/tokens/starbuck.svg";
import "./RewardItem.scss";
import { Divider, Button } from "antd";
import Countdown from "antd/es/statistic/Countdown";

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
      <img src={myimg} alt="img"/>

      <div className="content">
        <div className="info">
        <p className="title">ArtStarBuck</p>

        <div className="cost">
          <img
            src={tokenimg}
            alt="myIMG"
            style={{ width: "2.5rem", marginRight: 6 }}
          />
          <p>2000 SBP</p>
        </div>
      </div>


        <Divider className="divider" />

        <div className="action">
          <div className="time-left">
            <Countdown value={Date.now() + 1000 * 1000} valueStyle={{fontSize: '1.4rem', fontWeight:700, color:'#ccc'}}/>
          </div>

          <Button>Buy</Button>
        </div>
      </div>
    </div>
  );
};

export default RewardItem;
