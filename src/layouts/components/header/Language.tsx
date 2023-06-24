import React, { useEffect } from "react";
import cookie from "react-cookies";
import { useTranslation } from "react-i18next";
// import "./index.css";

const Language = () => {
  const { t , i18n } = useTranslation('common');

  const handleChangeLang = (lang:string) => {
    i18n.changeLanguage(lang);
    cookie.save('lang', lang, {path: '/'})
  };

  useEffect(()=>{
    let lang  = cookie.load('lang');
    if(lang){
      i18n.changeLanguage(lang);
    }
  },[])

  return (
    <>
      <div className="d-flex align-items-center popover-header-wrapper ml-3">
      {i18n.language !== "vi" ? (
                <div className='d-flex justify-content-center align-items-center cursor-pointer' onClick={()=> handleChangeLang('vi')}>
                <img
                  style={{ width: 35 }}
                  src="https://res.cloudinary.com/agridential/image/upload/v1592220424/images/vietnam_apf0al.svg"
                  alt="vi"
                />
                <span className='font-weight-bold ml-2 d-none d-xl-block'>Tiếng việt</span>
                </div>
              ) : (
                <div className='d-flex justify-content-center align-items-center cursor-pointer' onClick={()=> handleChangeLang('en')}>
                <img
                  style={{ width: 35 }}
                  src="https://res.cloudinary.com/agridential/image/upload/v1592220305/images/flag_b5mnjj.svg"
                  alt="en"
                />
                <span className='font-weight-bold ml-2 d-none d-xl-block'>English</span>
                </div>
              )}
      </div>
    </>
  );
};

export default Language;
