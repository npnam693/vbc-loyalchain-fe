interface ITokenItemProps {
  name: string;
  symbol: string;
  uriImg: any;
  network: string;
  balance: number;
}

export const TokenItem = (props: ITokenItemProps) => {
  return (
    <div
      style={{
        width: "100%",
        margin: "16px 0",
        backgroundColor: "#ccc",
        borderRadius: 5,
        padding: "5px 20px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <img
          src={props.uriImg}
          style={{ height: 50, marginRight: 10 }}
          alt="Token"
        />
        <div>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: 600,
              color: "#333",
            }}
          >
            {props.name}
          </p>

          <p
            style={{
              fontSize: "1.4rem",
              fontWeight: 500,
              color: "rgba(0,0,0,0.4)",
            }}
          >
            {props.network}
          </p>
        </div>
      </div>
      <p
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "rgba(0,0,0,0.7)",
        }}
      >
        {props.balance} {props.symbol}{" "}
      </p>
    </div>
  );
};
