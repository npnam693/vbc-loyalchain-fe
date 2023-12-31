import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import cookie from "react-cookies";

import VBC_Logo from "../../../assets/svg/logo_vbc-mod.svg";
import SITEMAP from "../../../constants/sitemap";
import "./Footer.scss";

const Footer = () => {
  const { t, i18n } = useTranslation("common");
  const currentUrl = useLocation().pathname;

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
            <p className="footer-company-intro">
            <span style={{fontWeight: 600}}>Vietnam Blockchain Corporation</span> - A leading pioneer of the Blockchain field in Vietnam aims to create new value for high quality Vietnamese branded products.
            </p>
          </div>

          <div className="app-footer--content">
            <div className="app-footer--sitemap">
              <p className="app-footer--sitemap--title">Sitemap</p>
              {SITEMAP.map((item, index) => (
                <Link
                  to={item.path}
                  className="app-footer--sitemap--link"
                  style={{
                    color:
                      currentUrl === item.path
                        ? "var(--color-secondary)"
                        : "var(--color-text-white)",
                  }}
                  key={index}
                >
                  {t(item.key)}
                </Link>
              ))}
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
              <p
                onClick={() => handleChangeLang("en")}
                style={{
                  color:
                    i18n.language === "en"
                      ? "var(--color-secondary)"
                      : "var(--color-text-white)",
                }}
              >
                {t("footer.lang.en")}
              </p>
              <p
                onClick={() => handleChangeLang("vi")}
                style={{
                  color:
                    i18n.language === "vi"
                      ? "var(--color-secondary)"
                      : "var(--color-text-white)",
                }}
              >
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
