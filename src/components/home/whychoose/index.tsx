import React from "react";
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
      <div style={StyleProps} className="app-whychoose">
        <img
          src={props.uriImg}
          alt="loyalChain"
          style={{
            height: 100,
          }}
        />

        <p
          style={{
            fontSize: "2.4rem",
            fontWeight: 600,
            color: "var(--primary-color)",
          }}
        >
          {props.title}
        </p>

        <p
          style={{
            marginTop: 4,
            fontSize: "1.6rem",
          }}
        >
          {props.content}
        </p>
      </div>
    );
  } else {
    return (
      <div
        style={{
          width: "65%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        className="app-whychoose"
      >
        <div style={{ flex: 0.7 }}>
          <p
            style={{
              fontSize: "2.4rem",
              fontWeight: 600,
              color: "var(--primary-color)",
            }}
          >
            {props.title}
          </p>
          <p
            style={{
              fontSize: "1.6rem",
              marginTop: 10,
            }}
          >
            {props.content}
          </p>
        </div>
        <img
          src={props.uriImg}
          alt="loyalChain"
          style={{
            height: "100%",
          }}
        />
      </div>
    );
  }
}