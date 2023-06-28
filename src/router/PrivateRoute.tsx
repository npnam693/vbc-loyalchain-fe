import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, useLocation } from "react-router-dom";
import { ROLE } from "../constants/role";
import LeftSidebar from "../layouts/components/LeftSidebar";
import NotFound from "../pages/notFound";
import { useAppSelector } from "../state/hooks";

const PrivateRoute = ({ roles }: { roles: Array<ROLE> }) => {
  let location = useLocation();

  // const { isAuthenticated, type, loading } = useAppSelector(
  //   (state) => state.userState
  // );

  // if (loading) {
  //   return <Navigate to="/login" state={{ from: location }} />;
  // }

  // const userHasRequiredRole = type && roles.includes(type) ? true : false;

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} />;
  // }

  // if (isAuthenticated && !userHasRequiredRole) {
  //   return <NotFound />; // build your won access denied page (sth like 404)
  // }

  return <LeftSidebar children={<Outlet />} />;
};

export default PrivateRoute;
