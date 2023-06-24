// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from "clsx";
import { useEffect } from "react";
import { Circle, Disc } from "react-feather";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { UncontrolledTooltip } from "reactstrap";
import { BECAS_LOGO, VBC } from "../../../constants/image";
import { useAppSelector } from "../../../state/hooks";
import {
  setSidebarToggle,
  setSidebarToggleMobile,
} from "../../../state/themeOptions/themeOptionsSlice";

const SidebarHeader = () => {
  const { sidebarToggleMobile, sidebarToggle } = useAppSelector(
    (state) => state.ThemeOptions
  );

  const distpatch = useDispatch();

  const toggleSidebarMobile = () => {
    distpatch(setSidebarToggleMobile(!sidebarToggleMobile));
  };

  const toggleSidebar = () => {
    distpatch(setSidebarToggle(!sidebarToggle));
  };

  useEffect(() => {
    if (
      document.documentElement &&
      document.documentElement.clientWidth &&
      document.documentElement.clientWidth < 1366 + 270
    ) {
      setSidebarToggle(true);
    }
  }, []);

  const handleHomepage = () => {
    window.open("https://agridential.vn/");
  };

  return (
    <>
      <div className="app-sidebar--header">
        <div className="app-sidebar-logo shadow-none">
          <NavLink
            to="/"
            onClick={handleHomepage}
            title="Becas"
            className="app-sidebar-logo shadow-none"
          >
            {/* <div className="app-sidebar-logo--icon shadow-none"> */}
            <img alt="Becas logo" className={clsx("img-fluid", {
              "img-sidebar-mini": sidebarToggle
            })} src={VBC} />
           
            <div className="divider"></div>
          </NavLink>
        </div>
        <button
          onClick={toggleSidebar}
          className="btn btn-sm collapse-sidebar-btn font-weight-bold d-flex justify-content-center align-items-center"
          id="CollapseSidebarTooltip"
        >
          <Disc size={18} />
        </button>
        <UncontrolledTooltip
          target="CollapseSidebarTooltip"
          container=".app-sidebar"
          placement="right"
        >
          Collapse sidebar
        </UncontrolledTooltip>
        <button
          className={clsx(
            "navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn",
            { "is-active": sidebarToggleMobile }
          )}
          onClick={toggleSidebarMobile}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </button>
        <button
          onClick={toggleSidebar}
          className="expand-sidebar-btn btn btn-sm"
          id="ExpandSidebarTooltip"
        >
          <Circle size={16} />
        </button>
        <UncontrolledTooltip
          target="ExpandSidebarTooltip"
          container=".app-sidebar"
          placement="right"
        >
          Expand sidebar
        </UncontrolledTooltip>
      </div>
    </>
  );
};

export default SidebarHeader;
