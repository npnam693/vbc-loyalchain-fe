import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Divider, Button, Slider, Drawer } from "antd";

import "./Marketplace.scss";
import Order from "../../components/marketplace/Order";
import SelectToken from "../../components/app/SelectToken";
import MarketPane from "../../components/marketplace/MarketPane";
import TableOrder from "../../components/marketplace/TableOrder";
import StatisticItem from "../../components/marketplace/StatisticItem";
import { CloseCircleOutlined } from "@ant-design/icons";
const Marketplace = () => {
  const [isListMode, setIsListMode] = useState(true);
  const [filter, setFilter] = useState({
    open: false,
    isFilterMode: true,
  });
  const [selectShow, setSelectShow] = useState(false);

  const navigate = useNavigate();

  const toggleModeView = () => {
    setIsListMode(!isListMode);
  };

  const openFilter = () => {
    setFilter({ open: true, isFilterMode: true });
  };

  const closeSelectToken = () => {
    setSelectShow(false);
  };

  return (
    <div className="app-market">
      <Drawer
        className="app-market-filter"
        style={{ backgroundColor: "var(--color-primary)" }}
        width={"36%"}
        closable={false}
        open={filter.open}
      >
        {filter.open && (
          <>
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
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setSelectShow(true)}
                  >
                    Select a token
                  </Button>
                  <p>Quantity</p>
                  <Slider
                    min={0}
                    max={10000}
                    range={{ draggableTrack: true }}
                    step={20}
                    railStyle={{
                      borderColor: "white",
                      color: "white",
                      backgroundColor: "#999",
                    }}
                  />
                </div>

                <div className="item">
                  <p>Swap to</p>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setSelectShow(true)}
                  >
                    Select a token
                  </Button>
                  <p>Quantity</p>
                  <Slider
                    min={0}
                    max={10000}
                    range={{ draggableTrack: true }}
                    step={20}
                    railStyle={{
                      borderColor: "white",
                      color: "white",
                      backgroundColor: "#999",
                    }}
                  />
                </div>

                {selectShow && (
                  <div>
                    <SelectToken closeFunction={closeSelectToken} />
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}
          </>
        )}
      </Drawer>

      <div className="header">
        <p className="title">Marketplace</p>
        <Button className="btn-create" onClick={() => navigate("create")}>
          Create Exchange Order
        </Button>
      </div>

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
