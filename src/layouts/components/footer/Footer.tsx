import React from "react";
import { VBC } from "../../../constants/image";
// import "./index.css";
const Footer = () => {
  return (
    <>
      <div className="py-3 px-3">
        <div className="w-100 d-flex align-items-center justify-content-center font-weight-bold text-dark bg-transparent flex-column flex-md-row">
          Becas © 2022 - created by{" "}
          <a
            href="https://vietnamblockchain.asia/"
            target="_blank"
            rel="noopener noreferrer"
            title="vietnamblockchain.asia"
          >
            <div className="app-footer--first ml-md-3 ml-0 mt-3 mt-md-0">
              <img src={VBC} alt="logoAGD" style={{ height: "30px" }} />
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
