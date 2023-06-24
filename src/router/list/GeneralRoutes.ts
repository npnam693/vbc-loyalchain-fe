import Login from "../../pages/login";
import { RouteProps } from "../../types/route";

const GeneralRoutes: Array<RouteProps> = [
  {
    path: "login",
    element: Login,
    title: "Login",
  }
];

export default GeneralRoutes;
