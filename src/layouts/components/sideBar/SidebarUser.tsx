import React from "react";
import { ChevronRight } from "react-feather";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NavLink } from "react-router-dom";
import UserRoutes from "../../../router/list/UserRoutes";
import { RouteProps } from "../../../types/route";
import clsx from "clsx";
import { useAppSelector } from "../../../state/hooks";

const SidebarUser = () => {
  const { t } = useTranslation("common");

  const renderItem = (item: RouteProps, index: number) => {
    if (item.isCollapsed) {
      return (
        <li className="px-3" key={index}>
          <a
            href="#/"
            className={clsx(
              // { "is-active": dashboardOpen },
              "wrap-collapse"
            )}
            id={"toggler" + index}
          >
            <span className="sidebar-icon">{item.icon && <item.icon />}</span>
            <span className="sidebar-item-label">{t(item.title)}</span>
            <span className="sidebar-icon-indicator">
              <ChevronRight />
            </span>
          </a>
          {/* <UncontrolledCollapse toggler={"#toggler" + index}>
            <ul>
              {item.list?.map((mini, idx) => (
                <li className="px-3" key={idx}>
                  <NavLink
                    className={"nav-link-simple " + mini.className}
                    to={mini.path}
                  >
                    <span className="font-weight-bold">{t(mini.title)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </UncontrolledCollapse> */}
        </li>
      );
    } else {
      return (
        <li className="px-3" key={index}>
          <NavLink
            className={"nav-link-simple " + item.className}
            to={item.path}
          >
            <span className="sidebar-icon">{item.icon && <item.icon />}</span>
            <span className="font-weight-bold">{t(item.title)}</span>
          </NavLink>
        </li>
      );
    }
  };
  return (
    <>
      <PerfectScrollbar>
        <div className="sidebar-navigation">
          <ul>
            {UserRoutes.map(
              (item, idx) =>
                item.icon && renderItem(item, idx)
            )}
          </ul>
        </div>
      </PerfectScrollbar>
    </>
  );
};

export default SidebarUser;
