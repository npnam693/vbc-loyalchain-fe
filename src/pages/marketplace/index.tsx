import clsx from "clsx";
import { useState } from "react";
import { Col, Row, Divider, Button, Slider } from "antd";

import "./Marketplace.scss";
import Order from "../../components/marketplace/Order";
import MarketPane from "../../components/marketplace/MarketPane";
import TableOrder from "../../components/marketplace/TableOrder";
import StatisticItem from "../../components/marketplace/StatisticItem";
import { CloseCircleOutlined } from "@ant-design/icons";
const Marketplace = () => {
  const [isListMode, setIsListMode] = useState(true);
  const [filter, setFilter] = useState({
    open: false,
    isFilterMode: false,
  });

  const toggleModeView = () => {
    setIsListMode(!isListMode);
  };

  const openFilter = () => {
    setFilter({ open: true, isFilterMode: true });
  };

  console.log(filter);
  return (
    <div className="app-market">
      {filter.open && (
        <div className="filter">
          <div className="filter-container">
            <div className="header">
              <div className="header--tab">
                <div
                  className={clsx("header--tab--item", {
                    "header--tab--item--show": filter.isFilterMode,
                  })}
                  onClick={() => setFilter({ ...filter, isFilterMode: true })}
                >
                  Filter
                </div>

                <div
                  className={clsx("header--tab--item", {
                    "header--tab--item--show": !filter.isFilterMode,
                  })}
                  onClick={() => setFilter({ ...filter, isFilterMode: false })}
                >
                  Sort
                </div>
              </div>

              <div className="header--option">
                <div className="header--option--item">Clear All</div>
                <div
                  onClick={() =>
                    setFilter({ open: !filter.open, isFilterMode: true })
                  }
                >
                  <CloseCircleOutlined
                    className="close-icon"
                    rev={"size"}
                    size={30}
                  />
                </div>
              </div>
            </div>

            <Divider className="divider" />

            {filter.isFilterMode ? (
              <div className="content-filter">
                <div className="item">
                  <p>Swap from</p>
                  <Button>Select a token</Button>
                  <p>Quantity</p>
                  <Slider
                    min={0}
                    max={10000}
                    range={{ draggableTrack: true }}
                    defaultValue={[0, 3000]}
                    step={20}
                    tooltip={{ open: true, placement: "bottom" }}
                    railStyle={{
                      borderColor: "white",
                      color: "white",
                      backgroundColor: "#999",
                    }}
                  />
                </div>

                <div className="item">
                  <p>Swap to</p>
                  <Button>Select a token</Button>
                  <p>Quantity</p>
                  <Slider
                    min={0}
                    max={10000}
                    range={{ draggableTrack: true }}
                    defaultValue={[0, 3000]}
                    step={20}
                    tooltip={{ open: true, placement: "bottom" }}
                    railStyle={{
                      borderColor: "white",
                      color: "white",
                      backgroundColor: "#999",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}

      <p className="title">Marketplace</p>

      <div className="statistic-list">
        <StatisticItem />
        <StatisticItem />
        <StatisticItem />
      </div>

      <MarketPane
        isListMode={isListMode}
        toggleModeView={toggleModeView}
        openFilter={openFilter}
      />

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
