import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "react-feather";
import { Input, Button, Popover } from "antd";
import clsx from "clsx";
import Web3 from "web3";
import { SafetyCertificateTwoTone } from "@ant-design/icons";

import { useAppSelector, useAppDispatch } from "../../../state/hooks";
import { saveInfo } from "../../../state/user/userSlice";
import Logo from "../../../assets/svg/logo_loyal-chain.svg";
import { initialUserState } from "../../../state/user/userSlice";
import { shortenAddress } from "../../../utils/string";
import PopoverUser from "./PopoverUser";
import "./Header.scss";
import SITEMAP from "../../../constants/sitemap";
import data from "./data.json";
const Header = () => {
  const currentUrl = useLocation().pathname;
  const { t } = useTranslation("common");
  const inputRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [web3Api, setWeb3Api] = useState<any>();
  const [openSearch, setOpenSearch] = useState(false);
  const [headerShow, setheaderShow] = useState(false);
  const userState = useAppSelector((state) => state.userState);

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

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      // Tạo một đối tượng web3 từ MetaMask provider
      const myUserState = Object.assign({}, initialUserState);
      const myWeb3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      myUserState.address = (await myWeb3.eth.getAccounts())[0];
      myUserState.network = String(await myWeb3.eth.net.getId());
      myUserState.balance = Number(
        await myWeb3.eth.getBalance(myUserState.address)
      );
      // Get access token from backend.
      myUserState.token = "hahahaha";
      myUserState.isAuthenticated = true;
      dispatch(saveInfo(myUserState));
      console.log(myUserState);
      setWeb3Api(myWeb3);
      const testNet = await window.ethereum.getNetwork(myUserState.network);
      console.log(testNet);
    } else {
      alert("MetaMask is not installed");
    }
  };

  const Deploycontract = async () => {
    let contract = new web3Api.eth.Contract(
      JSON.parse(JSON.stringify(data)).abi
    );
    const deploy = contract.deploy({
      data: JSON.parse(JSON.stringify(data)).bytecode,
      arguments: [
        "huhu",
        "khocr",
        ["0x6225D07A59be4F47400E8885d8EFC78FF7D9e171"],
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

            {userState.isAuthenticated ? (
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
