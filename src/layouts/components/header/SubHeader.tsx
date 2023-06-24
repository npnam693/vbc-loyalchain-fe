import clsx from "clsx";
import React from "react";
import { useAppSelector } from "../../../state/hooks";

function scrollFunction(check:boolean) {
    let navbar = document.getElementById("navBar");
    if (navbar) {
      navbar.classList.remove("sticky");
      navbar.classList.remove("sticky-true");
      if (window.pageYOffset > 40) {
        navbar.classList.add("sticky-true");
      } else {
        navbar.classList.remove("sticky-true");
      }
    } else {
      let navbar = document.getElementById("navBar");
      if (navbar) {
        navbar.classList.remove("sticky-true");
        navbar.classList.remove("sticky");
        if (window.pageYOffset >= 0) {
          navbar.classList.add("sticky");
        } else {
          navbar.classList.remove("sticky");
        }
      }
    }
}
const SubHeader = (props:{
    children: () => JSX.Element
}) => {
  const {
    pageTitleStyle,
    pageTitleBackground,
    pageTitleShadow,
    sidebarToggle,
  } = useAppSelector(state => state.ThemeOptions);

  React.useEffect(() => {
    window.addEventListener("scroll", () => {
      scrollFunction(sidebarToggle);
    });
    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, [sidebarToggle]);
  return (
    <>
      <div
        id="navBar"
        className={clsx("app-page-title", pageTitleStyle, pageTitleBackground, {
          "app-page-title--shadow": pageTitleShadow,
          "sticky-without-sidebar": sidebarToggle,
          "sticky-with-sidebar": !sidebarToggle,
        })}
      >
        <div className="w-100 d-flex flex-row">
          <div className="col-md-8 col-12 pr-0 pl-0">
            {/* <BreadCrumbs /> */}
          </div>
          <div className="d-flex col-md-4 col-12 justify-mobile-pagetitle align-items-center pr-0">
            <div>
                <props.children/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default SubHeader
