import Login from "../../pages/login";
import Home from "../../pages/home";
import Marketplace from "../../pages/marketplace";
import Reward from "../../pages/reward";
import CreateOrder from "../../pages/createOrder";
import Wallet from "../../pages/userWallet";

import { RouteProps } from "../../types/route";

const GeneralRoutes: Array<RouteProps> = [
  {
    path: "/",
    element: Home,
    title: "Introduction",
  },
  {
    path: "/marketplace",
    element: Marketplace,
    title: "Marketplace",
  },
  {
    path: "/rewards",
    element: Reward,
    title: "Reward",
  },
  {
    path: "login",
    element: Login,
    title: "Login",
  },
  {
    path: "/marketplace/create",
    element: CreateOrder,
    title: "Create",
  },
  {
    path: "/wallet",
    element: Wallet,
    title: "Wallet",
  },
];

export default GeneralRoutes;
