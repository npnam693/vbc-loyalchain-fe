import { Button } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import "./MarketPane.scss";

interface IMarketPaneProps {
  isListMode: boolean;
  openFilter: () => void;
  toggleModeView: () => void;
}

const MarketPane = (props: IMarketPaneProps) => {
  return (
    <div className="app-market--pane">
      <div>
        <Button
          className="all-filter"
          type="primary"
          size="large"
          onClick={() => props.openFilter()}
        >
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
          style={{
            backgroundColor: !props.isListMode
              ? "var(--color-secondary)"
              : "#ccc",
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
          style={{
            backgroundColor: props.isListMode
              ? "var(--color-secondary)"
              : "#ccc",
          }}
        >
          <BarsOutlined rev={""} />
        </Button>
      </div>
    </div>
  );
};

export default MarketPane;
