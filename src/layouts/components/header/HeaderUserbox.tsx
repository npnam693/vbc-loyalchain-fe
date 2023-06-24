import React, { useState } from "react";
import { List, LogOut, User } from "react-feather";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import authApi from "../../../api/authenApi";
import { AGD_LOGO } from "../../../constants/image";
import { ROLE } from "../../../constants/role";
import { useToggleAlert } from "../../../state/alert/hooks";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { useToggleNoti } from "../../../state/popup/hooks";
import { clearInfo } from "../../../state/user/userSlice";

const HeaderUserbox = () => {

  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const toggleAlert = useToggleAlert();
  const toggleNoti = useToggleNoti();
  const userInfo = useAppSelector((state) => state.userState);
  const distpatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSignOut = async () => {
    toggleAlert(true);
    await authApi.signOut();
    distpatch(clearInfo());
    toggleNoti(true, "success", "Đăng xuất thành công!");
    navigate("/login");
  };

  const handleAva = () => {
    if (userInfo) {
      if (
        userInfo.avatarLanguage &&
        userInfo.avatarLanguage.vi &&
        userInfo.avatarLanguage.vi.length > 0
      ) {
        if (
          userInfo.avatarLanguage.vi[0] &&
          userInfo.avatarLanguage.vi[0].image
        ) {
          if (userInfo.avatarLanguage.vi[0].image.secure_url) {
            return userInfo.avatarLanguage.vi[0].image.secure_url;
          }
        }
      } else {
        return AGD_LOGO;
      }
    }
  };

  const handleRedirect = (url: string) => {
    navigate(url);
    setIsOpen(!isOpen);
  };

  const handleOrderRedirect = () => {
    if (userInfo.role === "M") {
      handleRedirect("/registrationHistory/list");
    } else if (userInfo.role === "Z") {
      handleRedirect("/adminonly/registrationHistory/list");
    }
  };

  const handleRole = (role: ROLE) => {
    switch (role) {
      case ROLE.User:
        return "User";
      case ROLE.Admin:
        return "Admin";
      case ROLE.Employee:
        return "Nhân viên";
      default:
        return "User";
    }
  };

  return (
    <>
      <UncontrolledDropdown className="position-relative ml-3 bg-white rounded px-3 py-1">
        <DropdownToggle
          onClick={() => setIsOpen(!isOpen)}
          color="link"
          className="p-0 text-left d-flex btn-transition-none align-items-center"
        >
          <div className="d-none d-xl-block pr-2">
            <div className="font-weight-bold">{userInfo.name}</div>
            <span className="text-black-50">{handleRole(userInfo.role)}</span>
          </div>
          <div className="d-block p-0 avatar-icon-wrapper">
            <Badge color="success" className="badge-circle p-top-a">
              Online
            </Badge>
            <div className="avatar-icon rounded">
              <img src={handleAva()} alt="..." />
            </div>
          </div>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Welcome</DropdownItem>
          {/* {permissionData && permissionData.type !== "AGD_ADVANCE" ? (
            <>
              <DropdownItem onClick={() => handleRedirect("/packageStatus")}>
                <span className="text-success font-weight-bold">
                  Gói: {permissionData && permissionData.type}
                </span>
              </DropdownItem>
              <DropdownItem divider />
            </>
          ) : null} */}
          <DropdownItem
            onClick={() => handleRedirect("/profile")}
            className="text-black"
          >
            <span className="text-black">
              <User size={18} className="mr-2" /> {"Profile"}
            </span>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={handleSignOut}>
            <span className="text-black">
              <LogOut size={18} className="mr-2" /> {"Log out"}
            </span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  );
};

export default HeaderUserbox;
