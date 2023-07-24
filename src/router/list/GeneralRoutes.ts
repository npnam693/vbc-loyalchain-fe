import Home from "../../pages/home";
import Marketplace from "../../pages/marketplace";
import Reward from "../../pages/reward";
import Faucet from "../../pages/faucet";

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
    path: "/faucet",
    element: Faucet,
    title: "Faucet"
  }
];

export default GeneralRoutes;
