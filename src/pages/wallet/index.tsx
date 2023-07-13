import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../state/hooks";
import contractToken from "../../contract/Token/data.json";
import QRCode from "react-qr-code";
import "./Wallet.scss";

import {History, Reward, Token} from "./helper";
import { CopyOutlined } from "@ant-design/icons";
import appApi from "../../api/appAPI";
import { join } from "path";
interface IForm {
  token: string;
  amount: number;
  to: string;
}
enum WalletPage { TOKEN, REWARD, HISTORY }

const Wallet = () => {
  const [page, setPage] = useState<WalletPage>(WalletPage.TOKEN);
  
  const userState= useAppSelector((state) => state.userState);
  const contentPage = () => {
    if (page === WalletPage.TOKEN) {
      return <Token userState={userState} />;
    }
    else if (page === WalletPage.REWARD) {
      return <Reward />
    }
    else return <History />
  }

  const getJoinedTime = () : String  => {
    const joinTime = new Date(userState.createdAt)
    const nowTime = new Date()
    const joinedTime = (Number(nowTime.getTime()) - Number(joinTime.getTime())) / (1000 * 60 * 60 * 24)
    return String(joinedTime.toFixed(0)) + ' days'
  }

  console.log(getJoinedTime())
  return (
    <div className="app-wallet">
      <div className="content">
        <div className="content--left">
          <p className="title">My Wallet</p>
          <div className="account-info">Your address: 
            <p>{userState.address}
              <CopyOutlined rev={""} className="copy-icon"/> 
            </p>
          </div>
          <div className="account-info">
            Join time: 
            <p>{getJoinedTime()}</p></div>
          <div className="qrcode-container">
            <div className="qrcode">
              <QRCode
                size={200}
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
          <main>
          {
              contentPage()
          }
          </main>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
