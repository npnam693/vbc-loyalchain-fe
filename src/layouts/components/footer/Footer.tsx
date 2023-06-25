import React from "react";
import VBC_Logo from "../../../assets/svg/logo_vbc.svg"
import "./Footer.scss"


const Footer = () => {
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
                <img src={VBC_Logo} alt="logoAGD" style={{ height: "40px" }} />
              </div>
            </a>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In urna ultrices amet tellus ornare. Faucibus id posuere massa 
            </p>
          </div>

          <div className="app-footer--content">
            <div className="app-footer--sitemap">
              <p className="app-footer--sitemap-title">Sitemap</p>
              <p>Introduction</p>
              <p>Marketplace</p>
              <p>Rewards</p>
              <p>Blog</p>
              <p>About</p>
            </div>

            <div className="app-footer--company">
              <p className="app-footer--company-title">Company</p>
              <p>Help & Support</p>
              <p>Term & Conditions</p>
              <p>Privacy Policy</p>
            </div>
            
            <div className="app-footer--language">
              <p className="app-footer--language-title">Language</p>
              <p>English</p>
              <p>Vietnamese</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
