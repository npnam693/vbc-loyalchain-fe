import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "react-feather";
import { Input, Button, Popover } from "antd";
import clsx from "clsx";
import Web3 from "web3";
import { SafetyCertificateTwoTone } from "@ant-design/icons";

import { useAppSelector, useAppDispatch } from "../../../state/hooks";
import Logo from "../../../assets/svg/logo_loyal-chain.svg";
import { initialUserState } from "../../../state/user/userSlice";
import { shortenAddress } from "../../../utils/string";
import PopoverUser from "./PopoverUser";
import "./Header.scss";
import SITEMAP from "../../../constants/sitemap";
import data from "./data.json";
import { saveInfo } from "../../../state/user/userSlice";
import { saveWeb3 } from "../../../state/web3/web3Slice";
import axios from "axios";

const Header = () => {
  const currentUrl = useLocation().pathname;
  const { t } = useTranslation("common");
  const inputRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [openSearch, setOpenSearch] = useState(false);
  const [headerShow, setheaderShow] = useState(false);
  const userState = useAppSelector((state) => state.userState);
  const web3State = useAppSelector((state) => state.Web3State);

  window.onscroll = function () {
    if (!headerShow && window.scrollY >= 60) {
      setheaderShow(true);
    } else if (headerShow && window.scrollY < 60) {
      setheaderShow(false);
    }
  };

  useEffect(() => {
    if (openSearch && inputRef.current != null) {
      inputRef.current.focus();
    }
  }, [openSearch]);

  const signLogin = async (web3: any) => {
    const signature = await web3.eth.personal.sign(
      "Login",
      "0x6225D07A59be4F47400E8885d8EFC78FF7D9e171",
      ""
    );
    return signature;
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      const myUserState = Object.assign({}, initialUserState);

      const myWeb3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      myUserState.address = (await myWeb3.eth.getAccounts())[0];
      myUserState.network = String(await myWeb3.eth.net.getId());
      console.log("ccc");
      myUserState.balance = Number(
        await myWeb3.eth.getBalance(myUserState.address)
      );
      myUserState.isAuthenticated = true;

      const signature = await signLogin(myWeb3);
      console.log(signature);
      axios
        .post(
          "http://localhost:4333/api/auth/login",
          {
            address: myUserState.address,
            signature: signature,
            message: "Login",
          },
          { withCredentials: true }
        )
        .then((res) => {
          myUserState.token = res.data.accessToken;
          console.log(myUserState);
          dispatch(saveInfo(myUserState));
          dispatch(saveWeb3({ web3: myWeb3, isConnected: true }));
          console.log(res.data.cookie);
        })
        .catch((err) => {
          console.log("error");
        });

      // const signature = await myWeb3.eth.personal.sign(
      //   "Login",
      //   "0x6225D07A59be4F47400E8885d8EFC78FF7D9e171",
      //   ""
      // );

      // window.ethereum.on("accountsChanged", (accounts: any) => {
      //   const myWeb3 = new Web3(window.ethereum);
      //   const newweb3 = { web3: myWeb3, isConnected: true };
      //   dispatch(saveInfo({ ...myUserState, address: accounts[0] }));
      //   dispatch(saveWeb3(newweb3));

      //   console.log({ ...myUserState, address: accounts[0] });
      // });

      // window.ethereum.on("chainChanged", (chainId: any) => {
      //   console.log(chainId);
      // });

      // myWeb3.eth.subscribe("accountChanged", (accounts) =>
      //   setAccount(accounts[0])
      // );
    } else {
      alert("MetaMask is not installed");
    }
  };

  const Deploycontract = async () => {
    let contract = new web3State.web3.eth.Contract(
      JSON.parse(JSON.stringify(data)).abi
    );
    const deploy = contract.deploy({
      data: JSON.parse(JSON.stringify(data)).bytecode,
      arguments: [
        "huhu",
        "khocr",
        ["0x2a5b956d042f745835bcae7c75a9c806c20af371"],
      ],
    });

    const deployTransaction = deploy.send({
      from: userState.address,
      gas: 2100000,
    });

    // const recipt = await web3Api.eth.getTransactionReceipt(
    //   "0x457d89c09be00fe61dba08515a17661088f5f1236561b6ee58f13aefcbf79b7d"
    // );

    // console.log(recipt);

    // const deploy = contract.deploy({
    //   data: myData.bytecode,
    // });

    // const deployTransaction = deploy.send({
    //   from: userState.address,
    //   gas: 0,
    // });

    // deployTransaction.on("confirmation", (confirmationNumber, receipt) => {
    //   if (confirmationNumber === 1) {
    //     console.log("Contract deployed successfully!");
    //     console.log("Contract address:", receipt.contractAddress);
    //   }
    // });
  };

  return (
    <>
      <div
        className={clsx("app-header", {
          "app-header--shadow": headerShow,
        })}
      >
        {/* <div className="app-header--pane"> */}
        {/* <button
            className={clsx(
              'navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn',
              { 'is-active': sidebarToggleMobile }
            )}
            onClick={toggleSidebarMobile}>
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button> */}
        {/* </div> */}

        <div className="app-header--pane">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img
              src={Logo}
              alt="loyalChain"
              style={{ height: 42, marginRight: 10, cursor: "pointer" }}
              onClick={() => navigate("/")}
            />

            <div className="app-header--option">
              {SITEMAP.map((item, idx) => (
                <div>
                  <Link
                    to={item.path}
                    className={clsx({ tabFocus: currentUrl === item.path })}
                    key={idx}
                  >
                    {t(item.key)}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {openSearch ? (
              <Input.Search
                placeholder="Input search text"
                ref={inputRef}
                size="large"
                onBlur={() => setOpenSearch(!openSearch)}
              />
            ) : (
              <div
                onClick={() => setOpenSearch(!openSearch)}
                className="css-flex-row"
              >
                <Search color="white" size={24} />
              </div>
            )}

            {web3State.isConnected ? (
              <Popover
                content={PopoverUser}
                placement={"bottomRight"}
                // color="#C2EDFC"
              >
                <div className="header-popover--container">
                  <div className="network">
                    <SafetyCertificateTwoTone
                      rev={""}
                      size={10}
                      className="network-icon"
                    />
                    <p>AGD</p>
                  </div>
                  <Button type="primary" className="btn-connect_wallet">
                    {shortenAddress(userState.address)}
                  </Button>
                </div>
              </Popover>
            ) : (
              <Button
                type="primary"
                className="btn-connect_wallet"
                onClick={connectWallet}
                size="large"
              >
                Connect Wallet
              </Button>
            )}

            <Button
              type="primary"
              className="btn-connect_wallet"
              onClick={Deploycontract}
              size="large"
            >
              Deploycontract
            </Button>
          </div>

          {/* <HeaderDots /> */}
          {/* <HeaderUserbox /> */}
        </div>
      </div>
    </>
  );
};

export default Header;
