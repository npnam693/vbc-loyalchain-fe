import React, { useState } from "react";
import { useAppSelector } from "../../state/hooks";
import contractToken from "../../contract/Token/data.json";
import QRCode from "react-qr-code";

import { Button, Input, InputNumber } from "antd";
import "./Wallet.scss";


interface IForm {
  token: string;
  amount: number;
  to: string;
}
enum WalletPage {
  TOKEN,
  REWARD,
  HISTORY,
}

const Wallet = () => {
  const [page, setPage] = useState<WalletPage>(WalletPage.TOKEN);
  const [formData, setFormData] = useState<IForm>({
    token: "",
    amount: 0,
    to: "",
  });








  const myWeb3 = useAppSelector((state) => state.Web3State);

  const userState = useAppSelector((state) => state.userState);

  const transfer = async () => {
    if (!myWeb3.isConnected) {
      alert("M can phai dang nhap trc");
      return;
    }

    const contractABI = contractToken.abi; // ABI của hợp đồng bạn muốn chuyển đổi token
    const contractAddress = formData.token;
    const contract = new myWeb3.web3.eth.Contract(contractABI, contractAddress);

    const fromAddress = userState.address; // Địa chỉ ví nguồn (tài khoản của bạn)
    const toAddress = formData.to; // Địa chỉ ví đích

    const decimal = await contract.methods.decimals().call({
      from: userState.address,
    });

    const amount: BigInt = BigInt(10 ** Number(decimal) * formData.amount); // Số lượng token bạn muốn chuyển (1 token = 10^18 wei)

    // const transactionObject = {
    //   from: fromAddress,
    //   to: contractAddress,
    //   value: "0", // Nếu bạn chỉ chuyển token, value = 0
    //   data: contract.methods.transfer(toAddress, amount).encodeABI(),
    //   // gasLimit: await contract.methods.transfer(toAddress, amount).estimateGas({
    //   //   from: userState.address,
    //   //   data: contract.methods.transfer(toAddress, amount).encodeABI(),
    //   // }),
    //   // // maxPriorityFeePerGas: "0x00",
    //   // maxFeePerGas: "0x00",
    //   // nonce: await myWeb3.web3.eth.getTransactionCount(userState.address),
    //   // type: "0x02",
    //   // accessList: [],
    // };

    const myReceipt = await contract.methods.transfer(toAddress, amount).send({
      from: userState.address,
      gas: await contract.methods.transfer(toAddress, amount).estimateGas({
        from: userState.address,
        data: contract.methods.transfer(toAddress, amount).encodeABI(),
      }),
    });

    console.log("myReceipt", myReceipt);

    // myWeb3.web3.eth
    //   .sendTransaction(transactionObject)
    //   .on("transactionHash", (hash: any) => {
    //     console.log("Transaction hash:", hash);
    //   })
    //   .on("receipt", (receipt: any) => {
    //     console.log("Transaction receipt:", receipt);
    //   })
    //   .on("error", (error: any) => {
    //     console.error("Error:", error);
    //   });
  };

  const signAccount = async () => {
    if (!myWeb3.isConnected) {
      alert("M can phai dang nhap trc");
      return;
    }

    const message = "Hello world";
    const signature = await myWeb3.web3.eth.personal.sign(
      "Login",
      "0x6225D07A59be4F47400E8885d8EFC78FF7D9e171",
      ""
    );

    console.log("signature", signature);
  };

  return (
    <div className="app-wallet">

      <div className="content">
        <div className="content--left">
          <p className="title">My Wallet</p>
          <p>Your address: <span>{userState.address}</span></p>
          <p>Join time: <span>{userState.address}</span></p>

          <div className="qrcode-container">
            <div className="qrcode">
              <QRCode
                size={200}
                // style={{  width: "40%"}}
                value={userState.address}
              />
            </div>
          </div>

        </div>


        <div className="content--right">
          <header>
            <div className={`header-item${page === WalletPage.TOKEN ? ' header-item--selected' : ''}`}
              onClick={() => page !== WalletPage.TOKEN && setPage(WalletPage.TOKEN)}
            >
              <p>Token</p>
            </div>
            <div className={`header-item${page === WalletPage.REWARD ? ' header-item--selected' : ''}`}
              onClick={() => page !== WalletPage.REWARD && setPage(WalletPage.REWARD)}

            >
              <p>Reward</p>
            </div>
            <div className={`header-item${page === WalletPage.HISTORY ? ' header-item--selected' : ''}`}
              onClick={() => page !== WalletPage.HISTORY && setPage(WalletPage.HISTORY)}
            >
              <p>History</p>
            </div>
          </header>


        </div>

      </div>



      {/* <div style={{ fontSize: 20, color: "white" }}>
        Your address: <span>{userState.address}</span>{" "}
      </div>

      <div className="form">
        <Input
          addonBefore={"Token Address"}
          style={{ width: 600 }}
          value={formData.token}
          onChange={(e) => setFormData({ ...formData, token: e.target.value })}
        />

        <InputNumber
          addonBefore={"Amount"}
          value={formData.amount}
          onChange={(val) => setFormData({ ...formData, amount: Number(val) })}
          style={{ width: 400, marginTop: 20, marginBottom: 20 }}
        />

        <Input
          addonBefore={"To Address"}
          style={{ width: 600, marginBottom: 50 }}
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
        />
      </div>
      <Button onClick={transfer} type="primary" size="large">
        Transfer
      </Button>

      <p>------------------</p>
      <Button onClick={signAccount}>Sign Accounts</Button> */}
    </div>
  );
};

export default Wallet;
