import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

import "./Footer.scss";
import VBC_Logo from "../../../assets/svg/logo_vbc.svg";

const Footer = () => {
  const { t, i18n } = useTranslation("common");

  const handleChangeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    cookie.save("lang", lang, { path: "/" });
  };

  useEffect(() => {
    let lang = cookie.load("lang");
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  return (
    <>
      <div className="app-footer">
        <div className="app-footer--container">
          <div className="app-footer--intro">
            <a
              href="https://vietnamblockchain.asia/"
              target="_blank"
              rel="noopener noreferrer"
              title="vietnamblockchain.asia"
            >
              <div className="app-footer--logovbc">
                <img src={VBC_Logo} alt="logoAGD" />
              </div>
            </a>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In urna
              ultrices amet tellus ornare. Faucibus id posuere massa
            </p>
          </div>

          <div className="app-footer--content">
            <div className="app-footer--sitemap">
              <p className="app-footer--sitemap--title">Sitemap</p>
              <Link to="/" className="app-footer--sitemap--link">
                {t("nav.home")}
              </Link>
              <Link to="/marketplace" className="app-footer--sitemap--link">
                {t("nav.market")}
              </Link>
              <Link to="/reward" className="app-footer--sitemap--link">
                {t("nav.rewards")}
              </Link>
              <Link to="/blog" className="app-footer--sitemap--link">
                {t("nav.blog")}
              </Link>
              <Link to="/about" className="app-footer--sitemap--link">
                {t("nav.about")}
              </Link>
            </div>

            <div className="app-footer--company">
              <p className="app-footer--company--title">
                {t("footer.company.title")}
              </p>
              <p>{t("footer.company.about")}</p>
              <p>{t("footer.company.help")}</p>
              <p>{t("footer.company.policy")}</p>
            </div>

            <div className="app-footer--language">
              <p className="app-footer--language--title">
                {t("footer.lang.title")}
              </p>
              <p onClick={() => handleChangeLang("en")}>
                {t("footer.lang.en")}
              </p>
              <p onClick={() => handleChangeLang("vi")}>
                {t("footer.lang.vi")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
