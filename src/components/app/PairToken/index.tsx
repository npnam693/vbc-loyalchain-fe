import React from "react";
import tokenIMG from "../../../assets/svg/tokens/starbuck.svg";
import { Skeleton } from "antd";

interface IPairToken {
  from_img?: any;
  to_img?: any;
  width?: number;
}
const PairToken = (props: IPairToken) =>
  // props: IPairToken
  {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {
          !props.from_img ? 
            <Skeleton.Avatar active={true} size={36} shape={'circle'} style={{marginLeft: 16}}/>
            :
            <img 
              src={props.from_img || tokenIMG} 
              style={{ width: props.width || 36, marginLeft: 16 }} 
              alt="token" 
            />
        }
        {
          !props.to_img ? 
          <Skeleton.Avatar active={true} size={36} shape={'circle'} style={{right: 16, position:'relative'}} />
            :
          <img
            src={props.to_img || tokenIMG}
            style={{ width: props.width || 36, right: 16, position: "relative" }}
            alt="token"
          />
        }



      </div>
    );
  };

export default PairToken;
