import React, { useEffect } from "react";
import "./Reward.scss";
import RewardPane from "../../components/reward/Pane";
import RewardItem from "../../components/reward/RewardItem";
import { Col, Row, notification} from "antd";

const Reward = () => {
  const [api, contextHolder] = notification.useNotification();
  
  const openNotificationWithIcon = () => {
    api.info({
      message: `Notification`,
      description:
        'This feature is part of the upcoming development phase. Please wait for further updates',
      placement: "bottomLeft",
    })
  };

  useEffect(() => {
    openNotificationWithIcon()
  }, [])

  return (
    <div className="app-reward">
      {contextHolder}
      <p className="title">Discover Rewards with Loyalty Points</p>
      <div className="app-reward-pane">
        <RewardPane />
      </div>
      <div className="list-rewards">
      <RewardItem />
      <RewardItem />
      <RewardItem />
      <RewardItem />
      <RewardItem />
      <RewardItem />
      <RewardItem />
      <RewardItem />
      </div>
    </div>
) 

}
  


export default Reward;
