import { Divider, Input } from "antd";
import { TokenItem } from "./TokenItem";
import SBP from "../../../assets/svg/tokens/starbuck.svg";
import "./SelecToken.scss";
import { CloseCircleOutlined } from "@ant-design/icons";

interface ISelectTokenProps {
  closeFunction: () => void;
}

const SelectToken = (props: ISelectTokenProps) => {
  return (
    <div className="app-select_token">
      <div className="container">
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
          <TokenItem
            name="StarBuck Loyalty Point"
            network="AGD Network"
            symbol="SBP"
            balance={3000}
            uriImg={SBP}
          />
          <TokenItem
            name="StarBuck Loyalty Point"
            network="AGD Network"
            symbol="SBP"
            balance={3000}
            uriImg={SBP}
          />
          <TokenItem
            name="StarBuck Loyalty Point"
            network="AGD Network"
            symbol="SBP"
            balance={3000}
            uriImg={SBP}
          />
          <TokenItem
            name="StarBuck Loyalty Point"
            network="AGD Network"
            symbol="SBP"
            balance={3000}
            uriImg={SBP}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectToken;
