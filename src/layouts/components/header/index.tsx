import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "react-feather";
import { Input } from "antd";
import clsx from "clsx";

import Logo from "../../../assets/svg/logo_loyal-chain.svg";
import ConnectWallet from "./helper/ConnectWallet";
import SITEMAP from "../../../constants/sitemap";
import "./Header.scss";

const Header = () => {
  const currentUrl = useLocation().pathname;
  const { t } = useTranslation("common");
  const inputRef = useRef<any>(null);
  const navigate = useNavigate();

  const [openSearch, setOpenSearch] = useState(false);
  const [headerShow, setheaderShow] = useState(false);

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
                <div key={idx}>
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
            <ConnectWallet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
