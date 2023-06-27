import React from "react";
import "./Reward.scss";
import RewardPane from "../../components/reward/Pane";
import RewardItem from "../../components/reward/RewardItem";
import { Col, Row } from "antd";

const Reward = () => (
  <div className="app-reward">
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
);

export default Reward;
