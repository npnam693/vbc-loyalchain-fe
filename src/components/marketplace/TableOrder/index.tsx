import { Divider } from "antd";

import "./TableOrder.scss";

const baseTable = [
  {
    title: "ID",
    size: 0.1,
  },
  {
    title: "Transaction",
    size: 0.15,
  },
  {
    title: "Swap from",
    size: 0.15,
  },
  {
    title: "Swap to",
    size: 0.15,
  },
  {
    title: "Time create",
    size: 0.2,
  },
  { title: "Time left", size: 0.2 },
];

const mockData = [
  {
    ID: "601997",
    from: "SBP",
    amount_from: 3000,
    to: "SBP",
    amount_to: 3000,
    created: new Date(),
    time_left: "hahaha",
  },
  {
    ID: "601997",
    from: "SBP",
    amount_from: 3000,
    to: "SBP",
    amount_to: 3000,
    created: new Date(),
    time_left: "hahaha",
  },
  {
    ID: "601997",
    from: "SBP",
    amount_from: 3000,
    to: "SBP",
    amount_to: 3000,
    created: new Date(),
    time_left: "hahaha",
  },
  {
    ID: "601997",
    from: "SBP",
    amount_from: 3000,
    to: "SBP",
    amount_to: 3000,
    created: new Date(),
    time_left: "hahaha",
  },
];

export default function TableOrder() {
  return (
    <div className="app-order_table">
      <div className="header">
        {baseTable.map((element, index) => (
          <div className="header-item" style={{ flex: element.size }}>
            {element.title}
          </div>
        ))}
      </div>

      <Divider className="divider" />

      <div className="list-content">
        {mockData.map((element, index) => (
          <div className="content-item">
            <div className="item-field">
              {baseTable.map((element, index) => (
                <div className="header-item" style={{ flex: element.size }}>
                  {element.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
