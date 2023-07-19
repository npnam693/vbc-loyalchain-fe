import CreateOrder from "../../pages/marketplace/createOrder";
import Wallet from "../../pages/wallet";
import { RouteProps } from "../../types/route";
import MyOrder from "../../pages/marketplace/myOrder";
const UserRoutes: Array<RouteProps> = [
      {
        path: "/marketplace/create",
        element: CreateOrder,
        title: "Create",
      },
      {
        path: "/marketplace/my-order",
        element: MyOrder,
        title: "My Order",
      },
      {
        path: "/wallet",
        element: Wallet,
        title: "Wallet",
    },
];

export default UserRoutes;
