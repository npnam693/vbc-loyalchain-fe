import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as animationData from "../../../constants/json/download.json";
import { ROLE } from "../../../constants/role";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { setSidebarToggleMobile } from "../../../state/themeOptions/themeOptionsSlice";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import SidebarMenuLayout from "./SidebarMenuLayout";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Sidebar = () => {
  const { t } = useTranslation("common");
  const {
    sidebarStyle,
    sidebarFooter,
    sidebarToggleMobile,
    // setSidebarToggleMobile,
    sidebarToggle,
  } = useAppSelector((state) => state.ThemeOptions);

  const dispatch = useAppDispatch();

  const [modal, setModal] = useState<boolean>(false);

  // const {DowdloadImg} = useLottie(options);

  const toggle = () => {
    setModal(!modal);
  };

  const toggleSidebarMobile = () => {
    dispatch(setSidebarToggleMobile(!sidebarToggleMobile));
  };

  return (
    <>
      <div
        className={clsx("app-sidebar", sidebarStyle, "app-sidebar--light", {
          "app-sidebar--shadow": true,
        })}
      >
        <SidebarHeader />
        <div className="app-sidebar--content">
          {/* <SidebarMenuLayout roles={[ROLE.User]} /> */}
        </div>
        {sidebarFooter && <SidebarFooter />}
      </div>
      <div
        onClick={toggleSidebarMobile}
        className={clsx("app-sidebar-overlay", {
          "is-active": sidebarToggleMobile,
        })}
      />
    </>
  );
};

export default Sidebar;
