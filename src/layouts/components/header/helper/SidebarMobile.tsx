import { AppstoreOutlined } from "@ant-design/icons"
import { Divider, Drawer } from "antd"
import { useState } from "react";
import Logo from "../../../../assets/svg/logo_loyal-chain.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SITEMAP from "../../../../constants/sitemap";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const SidebarMobile = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const currentUrl = useLocation().pathname;
    const { t } = useTranslation("common");

    return (
    <div className="sidebar-mobile">
        <div onClick={() => setOpen(!open)}>
        <AppstoreOutlined rev="" style={{fontSize: '2.5rem', color: 'white', marginRight: 30}}/>
        </div>
        <Drawer title={<>           
             <img
              src={Logo}
              alt="loyalChain"
              height={200}
              className="app-logo"
              onClick={() => navigate("/")}
            /></>}
            headerStyle={{backgroundColor: '#1C1C1C'}}
            closeIcon={<></>}
            width={200}
            placement="left" 
            onClose={() => setOpen(false)} open={open}>
            {SITEMAP.map((item, idx) => (
            <div key={idx} onClick={() =>  setOpen(false)}>
                <Link
                to={item.path}
                className={clsx({ tabFocus: currentUrl === item.path })}
                >
                
                    <div className="sidebar-items">{t(item.key)}</div>
                    <Divider style={{margin: 0}} />
                </Link>
            </div>
            ))}
        </Drawer>
    </div>
)
}

export default SidebarMobile



