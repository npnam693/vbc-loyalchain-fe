import Login from "../../pages/login";
import Home from "../../pages/home";
import { RouteProps } from "../../types/route";

const GeneralRoutes: Array<RouteProps> = [
  {
    path: "/",
    element: Home,
    title: "Introduction",
  },
  {
    path: "login",
    element: Login,
    title: "Login",
  },
];

export default GeneralRoutes;
