import React, {useState, useRef, useEffect} from 'react';

import clsx from 'clsx';


import { useAppSelector } from '../../../state/hooks';
import HeaderDots from './HeaderDots';
import HeaderUserbox from './HeaderUserbox';
import Logo from '../../../assets/svg/logo_loyal-chain.svg';
import './Header.scss'
import { Search } from 'react-feather'
import { Input, Space } from 'antd';



const Header = () => {
  const {
    headerShadow,
    headerBgTransparent,
    sidebarToggleMobile,
    // setSidebarToggleMobile
  } = useAppSelector(state => state.ThemeOptions);



  const [openSearch, setOpenSearch] = useState(false)
  const inputRef = useRef<any>(null);
  



  const toggleSidebarMobile = () => {
    // setSidebarToggleMobile(!sidebarToggleMobile);
  };


  useEffect(() => {
    if(openSearch && inputRef.current!=null) {
      inputRef.current.focus();
    }
  }, [openSearch])

  return (
    <>
      <div
        className={clsx('app-header', {
          'app-header--shadow': headerShadow,
          'app-header--opacity-bg': headerBgTransparent
        })}>
        
        {/* <div className="app-header--pane"> */}
          {/* <button
            className={clsx(
              'navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn',
              { 'is-active': sidebarToggleMobile }
            )}
            onClick={toggleSidebarMobile}>
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button> */}
        {/* </div> */}
        
        <div className="app-header--pane">
          <div style={{display:'flex', flexDirection: 'row'}}>
            <img src={Logo} alt="loyalChain" style={{height: 42, marginRight: 10}}/>

            <div className="app-header--option">
              <div> <p>Introduction</p> </div>
              <div> <p>Marketplace</p> </div>
              <div> <p>Rewards</p> </div>
              <div> <p>Blog</p> </div>
              <div> <p>About</p> </div>
            </div>
          </div>

          <div style={{display:'flex', flexDirection: 'row', alignItems:'center'}}>
            {  
              openSearch ?
              <Input.Search 
                placeholder="input search text"  
                style={{ width: 200 }}
                ref={inputRef} 
                size='large'
                onFocus={() => setOpenSearch(!openSearch)}
                onBlur={() => setOpenSearch(!openSearch)} 
              />
              :
              <div onClick={() => setOpenSearch(!openSearch)} className='css-flex-row'>
                <Search color="white" size={24}  />
              </div>
            }

            <div className='btn-connect_wallet' style={{marginLeft: 24}}>
              <p style={{margin:0}}> Connect Wallet </p>
            </div>
         
          </div>

          {/* <HeaderDots /> */}
          {/* <HeaderUserbox /> */}
        </div>
      </div>
    </>
  );
};


export default Header;
