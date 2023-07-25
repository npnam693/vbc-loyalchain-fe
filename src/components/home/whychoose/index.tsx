import React from "react";
import imgmy from "../../../assets/svg/home/whychoose-img1.svg";
import "./WhyChoose.scss";
interface IWhyChooseProps {
  size: number;
  uriImg: string;
  title: string;
  content: string;
}

interface IStyleProps {
  width: number | string;
  height: number | string;
  padding: number | string;
  borderRadius: number | string;
  backgroundColor: string;
}
const StyleProps: IStyleProps = {
  width: "30%",
  height: 300,
  padding: 40,
  borderRadius: 20,
  backgroundColor: "rgba(255, 255, 255,0.7)",
};

export default function WhyChoose(props: IWhyChooseProps): JSX.Element {
  if (props.size === 1) {
    return (
      <div className="app-whychoose">
        <img src={imgmy} alt="loyalChain" />

        <p
            className="app-whychoose--title"

        >
          {props.title}
        </p>

        <p
            className="app-whychoose--desc"

        >
          {props.content}
        </p>
      </div>
    );
  } else {
    return (
      <div

        className="app-whychoose-2"
      >
        <div style={{ flex: 0.6 }}>
          <p
            className="app-whychoose--title"
          >
            {props.title}
          </p>
          <p
            className="app-whychoose--desc"
          >
            {props.content}
          </p>
        </div>
        <img
          src={props.uriImg}
          alt="loyalChain"
          className="app-whychoose--img"
        />
      </div>
    );
  }
}
