import { Button } from "antd";
import "./Pane.scss";

const mockDataPane = ["StarBucks", "McDonald", "Walmart", "Ticket", "Music"];

const RewardPane = () => {
  return (
    <div className="app-reward--pane">
      <Button className="all-filter" type="primary" size="large">
        All Categories
      </Button>

      {mockDataPane.map((item, index) => (
        <Button type="primary" size="middle" key={index}>
          {item}
        </Button>
      ))}
    </div>
  );
};

export default RewardPane;
