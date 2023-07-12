import { Button, Popover } from "antd";
import { AppstoreOutlined, BarsOutlined, ClearOutlined } from "@ant-design/icons";
import "./MarketPane.scss";

interface IMarketPaneProps {
  isListMode: boolean;
  openFilter: () => void;
  dataFilter: any;  
  toggleModeView: () => void;
  funcNetwork?: (network: string) => void;
  funcSwapTo?: () => void;
  funcSwapFrom?: () => void;
  funcClearFilter?: () => void;
}

const MarketPane = (props: IMarketPaneProps) => {
  const content = (
    <div className="pane-popover">
      <div className="pane-popover--item"
        onClick={() => props.funcNetwork && props.funcNetwork("MBC")}
      >MBC Network</div>
      <div className="pane-popover--item"
        onClick={() => props.funcNetwork && props.funcNetwork("AGD")}
      >AGD Network</div>
      <div className="pane-popover--item"
        onClick={() => props.funcNetwork && props.funcNetwork("Cross")}
      >Cross Network</div>
    </div>
  );
  return (
    <div className="app-market--pane">
      <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
        <Button
          className="all-filter"
          type="primary"
          size="large"
          onClick={() => props.openFilter()}
        >
          All Filters
        </Button>
        
        <Popover placement="bottom" trigger="click" content={content}>
          <Button type="primary" size="middle">
            {
              props.dataFilter.network === '' ? 'Network' :
              props.dataFilter.network + ' Network'
            }
          </Button>
        </Popover>
        
        <Button type="primary" size="middle" onClick={props.funcSwapFrom} >
          {
            props.dataFilter.from !== '' ?
            <div style={{display:'flex', flexDirection:'row', alignItems:"center"}}>
              <img src={props.dataFilter.from.image} alt="token" style={{height: 20, marginRight: 10}}/>
              <p>{props.dataFilter.from.symbol}</p>
            </div>
            :
            'Swap From'
          }
        </Button>
        <Button type="primary" size="middle"  onClick={props.funcSwapTo}>
          {
            props.dataFilter.to !== '' ?
            <div style={{display:'flex', flexDirection:'row', alignItems:"center"}}>
              <img src={props.dataFilter.to.image} alt="token" style={{height: 20, marginRight: 10}}/>
              <p>{props.dataFilter.to.symbol}</p>
            </div>
            :
            'Swap To'
          }
        </Button>
        
        <div className="icon-clearfilter" onClick={props.funcClearFilter}>
          <ClearOutlined rev={""}/>
        </div>

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
