import clsx from "clsx";
import PropTypes from "prop-types";
import { Header } from ".";
import { useAppSelector } from "../../state/hooks";
import Footer from "./footer/Footer";
import Sidebar from "./sideBar/Sidebar";

interface LeftSidebarProps{
    children: any
    //JSX.Element
} 

const LeftSidebar = ({children}: LeftSidebarProps ) => {
  const {
    sidebarToggle,
    sidebarToggleMobile,
    sidebarFixed,
    // headerFixed,
    headerSearchHover,
    headerDrawerToggle,
    footerFixed,
  } = useAppSelector(state => state.ThemeOptions);

  return (
    <>
      <div
        className={clsx("app-wrapper", "bg-neutral-dark-f9", {
          "header-drawer-open": headerDrawerToggle,
          "app-sidebar-collapsed": sidebarToggle,
          "app-sidebar-mobile-open": sidebarToggleMobile,
          "app-sidebar-fixed": sidebarFixed,
          "app-header-fixed": false,
          "app-footer-fixed": footerFixed,
          "search-wrapper-open": headerSearchHover,
        })}
      >
        <div>
          <Sidebar />
        </div>
        <div className="app-main position-relative">
          <Header />
          <div className="app-content">
            <div className="app-content--inner bg-neutral-cream border-inner-dashboard">
              <div className="app-content--inner__wrapper">
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

LeftSidebar.propTypes = {
  children: PropTypes.node,
};


export default LeftSidebar;
