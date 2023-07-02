import Home from "../../pages/home";
import Marketplace from "../../pages/marketplace";
import Reward from "../../pages/reward";
import CreateOrder from "../../pages/createOrder";
import Wallet from "../../pages/wallet";


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
