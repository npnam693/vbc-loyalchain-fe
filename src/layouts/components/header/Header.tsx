import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "react-feather";
import { Input, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

import clsx from "clsx";

import { useAppSelector } from "../../../state/hooks";
import Logo from "../../../assets/svg/logo_loyal-chain.svg";
import HeaderUserbox from "./HeaderUserbox";
import HeaderDots from "./HeaderDots";
import "./Header.scss";

const Header = () => {
  const { t } = useTranslation("common");
  const [headerShow, setheaderShow] = useState(false);
  const navigate = useNavigate();

  window.onscroll = function () {
    if (!headerShow && window.scrollY >= 60) {
      setheaderShow(true);
    } else if (headerShow && window.scrollY < 60) {
      setheaderShow(false);
    }
  };

  const currentUrl = useLocation().pathname;
  console.log("currentUrl", currentUrl);

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
              style={{ height: 42, marginRight: 10, cursor: "pointer" }}
              onClick={() => navigate("/")}
            />

            <div className="app-header--option">
              <div>
                <Link to="/" className={clsx({ tabFocus: currentUrl === "/" })}>
                  {t("nav.home")}
                </Link>
              </div>
              <div>
                <Link
                  to="/marketplace"
                  className={clsx({ tabFocus: currentUrl === "/marketplace" })}
                >
                  {t("nav.market")}
                </Link>
              </div>
              <div>
                <Link
                  to="/rewards"
                  className={clsx({ tabFocus: currentUrl === "/rewards" })}
                >
                  {t("nav.rewards")}
                </Link>
              </div>
              <div>
                <Link
                  to="/blog"
                  className={clsx({ tabFocus: currentUrl === "/blog" })}
                >
                  {t("nav.blog")}
                </Link>
              </div>
              <div>
                <Link
                  to="/about"
                  className={clsx({ tabFocus: currentUrl === "/about" })}
                >
                  {t("nav.about")}
                </Link>
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
