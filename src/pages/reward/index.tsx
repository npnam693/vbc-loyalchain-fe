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
      <RewardPane />

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <RewardItem />
        </Col>
        <Col span={6}>
          <RewardItem />
        </Col>
        <Col span={6}>
          <RewardItem />
        </Col>
        <Col span={6}>
          <RewardItem />
        </Col>
        <Col span={6}>
          <RewardItem />
        </Col>
      </Row>
    </div>
) 

}
  


export default Reward;
