import CreateOrder from "../../pages/createOrder";
import Wallet from "../../pages/wallet";
import { RouteProps } from "../../types/route";

const UserRoutes: Array<RouteProps> = [
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

export default UserRoutes;
