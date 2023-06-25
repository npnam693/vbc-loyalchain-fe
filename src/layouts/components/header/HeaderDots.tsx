import React from "react";
import { Bell } from "react-feather";
import Language from "./Language";

const HeaderDots = () => {
  return (
    <div className="d-flex align-items-center popover-header-wrapper">
      <div className="mr-4">
        <Language />
      </div>
    </div>
  );
};

export default HeaderDots;
