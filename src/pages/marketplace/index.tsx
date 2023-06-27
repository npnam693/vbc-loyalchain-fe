import clsx from "clsx";
import { useState } from "react";
import { Col, Row, Table } from "antd";

import "./Marketplace.scss";
import Order from "../../components/marketplace/Order";
import MarketPane from "../../components/marketplace/MarketPane";
import TableOrder from "../../components/marketplace/TableOrder";
import StatisticItem from "../../components/marketplace/StatisticItem";

const Marketplace = () => {
  const [isListMode, setIsListMode] = useState(true);
  const [filter, setFilter] = useState(false);

  const toggleModeView = () => {
    setIsListMode(!isListMode);
  };

  return (
    <div
      className={clsx("app-market", {
        "app-market--filter": filter,
      })}
    >
      {filter && (
        <div className="filter">
          <div className="filter-container"></div>
        </div>
      )}

      <p className="title">Marketplace</p>

      <div className="statistic-list">
        <StatisticItem />
        <StatisticItem />
        <StatisticItem />
      </div>

      <MarketPane isListMode={isListMode} toggleModeView={toggleModeView} />

      {isListMode ? (
        <TableOrder />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Order />
          </Col>
          <Col span={6}>
            <Order />
          </Col>
          <Col span={6}>
            <Order />
          </Col>
          <Col span={6}>
            <Order />
          </Col>
          <Col span={6}>
            <Order />
          </Col>
        </Row>
      )}

      {/* <Order />
      <Order />
      <Order />
      <Order />
      <Order /> */}
    </div>
  );
};

export default Marketplace;
