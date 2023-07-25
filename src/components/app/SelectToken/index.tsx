import { Divider, Input } from "antd";
import { TokenItem } from "./TokenItem";
import { CloseCircleOutlined } from "@ant-design/icons";

import "./SelecToken.scss";
import { useAppSelector } from "../../../state/hooks";
import { getTokenInOtherNetwork, mappingNetwork } from "../../../utils/blockchain";
import { requestChangeNetwork } from "../../../services/metamask";


interface ISelectTokenProps {
  closeFunction: () => void;
  onClickSelect?: (token : any) => void;
  top_css?: string;
  right_css?: string;
  isFiller?: boolean;
  isCheckNetwork?: boolean;
  hiddenOtherNetwork?: boolean;
  tokenHidden?: string;
  hiddenChain?: number;
}

const SelectToken = (props: ISelectTokenProps) => {
  const appState = useAppSelector((state) => state.appState);
  const userState = useAppSelector((state) => state.userState);

  return (
    <div
      className="app-select_token"
      style={{ marginLeft: "auto", margin: "auto" }}
      onClick={props.closeFunction}
    >
      <div
        className="container"
        style={
          props.top_css
            ? {
                top: props.top_css,
                right: props.right_css,
                left: "auto",
              }
            : {}
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="close" onClick={props.closeFunction}>
          <CloseCircleOutlined className="close--icon" rev={"size"} />
        </div>

        <div className="header">
          <p className="title">Select a Token</p>
          <p className="desc">Select token of loyalty program you want.</p>
        </div>
        <Divider className="divider" />
        <Input.Search
          placeholder="Enter loyalty program token name or symbol"
          style={{fontSize:'1.2rem'}}
        />
        {
          appState.isConnectedWallet ?
          <div>
            {userState.wallet.map((item , index) =>{
              if ((props.tokenHidden && props.tokenHidden === item.token.deployedAddress) || 
                  (props.hiddenChain && props.hiddenChain === item.token.network)
              ) return <></>
              else return(
                <TokenItem
                  onClickItem={() => props.onClickSelect && props.onClickSelect(item)}
                  name={item.token.name}
                  network={mappingNetwork(item.token.network)}
                  symbol={item.token.symbol}
                  balance={item.balance}
                  uriImg={item.token.image}
                  key={index}
                />
              )
            } 
            )}
            
            {
              (props.hiddenOtherNetwork && props.hiddenOtherNetwork === true) ? null :
              getTokenInOtherNetwork(appState.tokens, userState).map((item, index) => {
                if (props.tokenHidden && props.tokenHidden === item.deployedAddress) return <></>
                else return (
                  <TokenItem
                    onClickItem={async () => {
                      if(props.isCheckNetwork) {
                        requestChangeNetwork(item.network)
                      } 
                      else {
                         props.onClickSelect && props.onClickSelect({balance: 0, token:item})
                      }
                    }}
                    name={item.name}
                    network={mappingNetwork(item.network)}
                    symbol={item.symbol}
                    balance={"*"}
                    uriImg={item.image}
                    key={index}
                  />
                )})
              }
          </div>
          : 
          <div>
            {
              appState.tokens.map((item, index) => (
                <TokenItem
                onClickItem={() => props.onClickSelect && props.onClickSelect(item)}
                name={item.name}
                network={mappingNetwork(item.network)}
                symbol={item.symbol}
                balance={"*"}
                uriImg={item.image}
                key={index}
                />
              ))
            }
          </div>
        }
      </div>
    </div>
  );
};

export default SelectToken;
