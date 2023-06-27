import { Button } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import "./MarketPane.scss";

interface IMarketPaneProps {
  isListMode: boolean;
  toggleModeView: () => void;
}

const MarketPane = (props: IMarketPaneProps) => {
  return (
    <div className="app-market--pane">
      <div>
        <Button className="all-filter" type="primary" size="large">
          All Filters
        </Button>

        <Button type="primary" size="middle">
          Swap From
        </Button>
        <Button type="primary" size="middle">
          Quantity Send{" "}
        </Button>
        <Button type="primary" size="middle">
          Swap To
        </Button>
        <Button type="primary" size="middle">
          Quantity Receive
        </Button>
      </div>

      <div>
        <Button
          type="primary"
          size="middle"
          onClick={() => {
            if (props.isListMode) props.toggleModeView();
          }}
        >
          <AppstoreOutlined rev={""} />
        </Button>

        <Button
          type="primary"
          size="middle"
          onClick={() => {
            if (!props.isListMode) props.toggleModeView();
          }}
        >
          <BarsOutlined rev={""} />
        </Button>
      </div>
    </div>
  );
};

export default MarketPane;
