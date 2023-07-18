import { Button, Popover } from "antd";
import { AppstoreOutlined, BarsOutlined, ClearOutlined } from "@ant-design/icons";
import "./MarketPane.scss";

interface IMarketPaneProps {
  isListMode: boolean;
  openFilter: () => void;
  dataFilter: any;  
  toggleModeView: () => void;
  funcNetwork: (network: number) => void;
  funcSwapTo?: () => void;
  funcSwapFrom?: () => void;
  funcClearFilter?: () => void;
}

const MarketPane = (props: IMarketPaneProps) => {
  console.log('vcl', props.dataFilter)

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
        

        <div>
          <Button style={{margin: 0, borderRadius: 0, borderTopLeftRadius: 6, borderBottomLeftRadius: 6, 
            backgroundColor: props.dataFilter.network === 4444 ? 'rgba(21, 191, 253, 0.5)' : '#ccc' }}
            onClick={() => {
              if (props.dataFilter.network === 4444)
                props.funcNetwork(-1)
              else props.funcNetwork(4444)
            }}
          >
            MBC
          </Button>

          <Button style={{margin: 0, borderRadius: 0,
            backgroundColor: props.dataFilter.network === 8888 ? 'rgba(21, 191, 253, 0.5)' : '#ccc' }}
            onClick={() => {
              if (props.dataFilter.network === 8888)
                props.funcNetwork(-1)
              else props.funcNetwork(8888)
            }}>
            AGD
          </Button>

          <Button style={{margin: 0, borderRadius: 0, borderTopRightRadius: 6, borderBottomRightRadius: 6,
            backgroundColor: props.dataFilter.network === 0 ? 'rgba(21, 191, 253, 0.5)' : '#ccc' }}
            onClick={() => {
              if (props.dataFilter.network === 0)
                props.funcNetwork(-1)
              else props.funcNetwork(0)
            }}          >
            Cross Network
          </Button>
        </div>
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
