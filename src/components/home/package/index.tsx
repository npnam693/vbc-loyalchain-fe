import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "./Package.scss";

interface IPackage {
  premium: boolean;
  type: string;
  contents: string[];
  money: number;
}

const Package = (props: IPackage): JSX.Element => {
  const stylePackageContainer = {
    width: props.premium ? 320 : 300,
    height: props.premium ? 468 : 400,
    backgroundColor: props.premium ? "#294199" : "white",

    borderRadius: 20,
  };

  return (
    <div style={stylePackageContainer} className="app-package">
      <div
        className="header-pane"
        style={{ backgroundColor: props.premium ? "#F3AA17" : "#294199" }}
      ></div>

      <p
        className="type-text"
        style={{ color: props.premium ? "#F3AA17" : "#294199" }}
      >
        {props.type}
      </p>

      <p className="money-text">{props.money}$</p>

      {props.contents.map((content, index) => (
        <div className="content-item" key={index}>
          <CheckOutlined
            style={{
              fontSize: "16px",
              color: "#08c",
              top: 0,
              position: "relative",
            }}
            rev={""}
          />
          <p>{content}</p>
        </div>
      ))}

      <Button
        shape="round"
        size="large"
        type={props.premium ? "primary" : "default"}
        style={{
          borderColor: "#F3AA17",
          borderWidth: 2.5,

          display: "flex",
          alignItems: "center",
          color: props.premium ? "white" : "#294199",
          fontWeight: 600,
          paddingBottom: 10,
          marginTop: "auto",
          marginBottom: 60,
          backgroundColor: props.premium ? "#F3AA17" : "white",
        }}
      >
        Buy Now
      </Button>
    </div>
  );
};

export default Package;
