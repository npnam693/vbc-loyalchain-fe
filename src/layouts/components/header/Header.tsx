import React from 'react';

import clsx from 'clsx';


import { useAppSelector } from '../../../state/hooks';
import HeaderDots from './HeaderDots';
import HeaderUserbox from './HeaderUserbox';

const Header = () => {
  const {
    headerShadow,
    headerBgTransparent,
    sidebarToggleMobile,
    // setSidebarToggleMobile
  } = useAppSelector(state => state.ThemeOptions);

  const toggleSidebarMobile = () => {
    // setSidebarToggleMobile(!sidebarToggleMobile);
  };

  return (
    <>
      <div
        className={clsx('app-header', {
          'app-header--shadow': headerShadow,
          'app-header--opacity-bg': headerBgTransparent
        })}>
        <div className="app-header--pane">
          <button
            className={clsx(
              'navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn',
              { 'is-active': sidebarToggleMobile }
            )}
            onClick={toggleSidebarMobile}>
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>
        <div className="app-header--pane">
          <HeaderDots />
          <HeaderUserbox />
        </div>
      </div>
    </>
  );
};


export default Header;
