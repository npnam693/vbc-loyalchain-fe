import React from "react";
import { ROLE } from "../../../constants/role";
import NotFound from "../../../pages/notFound";
import { useAppSelector } from "../../../state/hooks";
import SidebarUser from "./SidebarUser";

const SidebarMenuLayout = ({ roles }: { roles: Array<ROLE> }) => {
  // const { type } = useAppSelector((state) => state.userState);
  // const userHasRequiredRole = type && roles.includes(type) ? true : false;
  // if (userHasRequiredRole) {
  //   if (type === ROLE.User) {
  //     return <SidebarUser />;
  //   }else{
  //       return <NotFound/>
  //   }
  // } else {
  //   return <NotFound />;
  // }
};

export default SidebarMenuLayout;
