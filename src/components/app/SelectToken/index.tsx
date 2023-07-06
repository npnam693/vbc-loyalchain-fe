import { Divider, Input } from "antd";
import { TokenItem } from "./TokenItem";
import { CloseCircleOutlined } from "@ant-design/icons";

import "./SelecToken.scss";
import SBP from "../../../assets/svg/tokens/starbuck.svg";
import MDP from "../../../assets/svg/tokens/MDP.svg";
import WMP from "../../../assets/svg/tokens/WMP.svg";
import SAP from "../../../assets/svg/tokens/SAP.svg";
import { useAppSelector } from "../../../state/hooks";
import { getTokenInOtherNetwork, mappingNetwork } from "../../../utils/blockchain";

export const mockDataToken = [
  {
    name: "StarBuck Loyalty Point",
    network: "AGD Network",
    symbol: "SBP",
    balance: 3000,
    uriImg: SBP,
    address: "0x1234567890",
  },
  {
    name: "McDonald Loyalty Point",
    network: "AGD Network",
    symbol: "MDP",
    balance: 5000,
    uriImg: MDP,
    address: "0x1234567890",
  },
  {
    name: "Walmart Loyalty Point",
    network: "MBC Network",
    symbol: "WMP",
    balance: 3000,
    uriImg: WMP,
    address: "0x1234567890",
  },
  {
    name: "Singapore Airlines Loyalty Point",
    network: "MBC Network",
    symbol: "SAP",
    balance: 1000,
    uriImg: SAP,
    address: "0x1234567890",
  },
];

interface ISelectTokenProps {
  closeFunction: () => void;
  onClickSelect?: (token : any) => void;
  top_css?: string;
  right_css?: string;
}

const SelectToken = (props: ISelectTokenProps) => {
  const tokenState = useAppSelector((state) => state.appState.tokens);
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
          placeholder="input search loading default"
          loading
          size="large"
        />

        <div>
          {userState.wallet.map((item , index) => {
            return (
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
          })}
          
          {
            getTokenInOtherNetwork(tokenState, userState).map((item, index) => {
                          return (
              <TokenItem
                onClickItem={() => alert("Switch network to Select Token")}
                name={item.name}
                network={mappingNetwork(item.network)}
                symbol={item.symbol}
                balance={"*"}
                uriImg={item.image}
                key={index}
              />
            )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default SelectToken;
