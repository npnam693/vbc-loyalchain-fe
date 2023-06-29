import React from "react";
import { Button } from "antd";
import { useAppSelector } from "../../state/hooks";

const Wallet = () => {
  const userState = useAppSelector((state) => state.userState);

  const transferMoney = () => {};

  return (
    <div>
      Wallet
      <p>Address: {userState.address}</p>
      <p>Balance: {userState.balance}</p>
      <Button>Transfer</Button>
    </div>
  );
};

export default Wallet;
