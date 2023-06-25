import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useAppSelector } from "../../../state/hooks";
import HeaderDots from "./HeaderDots";
import HeaderUserbox from "./HeaderUserbox";
import Logo from "../../../assets/svg/logo_loyal-chain.svg";
import { Search } from "react-feather";
import { Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import "./Header.scss";

const Header = () => {
  const { t } = useTranslation("common");
  const [headerShow, setheaderShow] = useState(false);
  window.onscroll = function () {
    if (!headerShow && window.scrollY >= 60) {
      setheaderShow(true);
    } else if (headerShow && window.scrollY < 60) {
      setheaderShow(false);
    }
  };

  const {
    headerShadow,
    headerBgTransparent,
    sidebarToggleMobile,
    // setSidebarToggleMobile
  } = useAppSelector((state) => state.ThemeOptions);

  const [openSearch, setOpenSearch] = useState(false);

  const inputRef = useRef<any>(null);

  const toggleSidebarMobile = () => {
    // setSidebarToggleMobile(!sidebarToggleMobile);
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
          "app-header--opacity-bg": headerBgTransparent,
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
              style={{ height: 42, marginRight: 10 }}
            />

            <div className="app-header--option">
              <div>
                <p>{t("nav.home")}</p>
              </div>
              <div>
                <p>{t("nav.market")}</p>
              </div>
              <div>
                <p>{t("nav.rewards")}</p>
              </div>
              <div>
                <p>{t("nav.blog")}</p>
              </div>
              <div>
                <p>{t("nav.about")}</p>
              </div>
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

            <Button type="primary" className="btn-connect_wallet">
              Connect Wallet
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
