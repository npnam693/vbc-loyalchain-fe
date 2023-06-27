import React from "react";
import "./StatisticItem.scss";

const StatisticItem = () => {
  return (
    <div className="app-statistic">
      <div className="title">
        Amount Order
        <span>{"  "}(now)</span>
      </div>

      <p>3.000</p>
    </div>
  );
};

export default StatisticItem;
