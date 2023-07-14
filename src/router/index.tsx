import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/notFound";
import GeneralRoutes from "./list/GeneralRoutes";
import UserRoutes from "./list/UserRoutes";
import { useAppSelector } from "../state/hooks";
const RouterList = () => {
  const appState = useAppSelector((state) => state.appState);

  
  return (
    <Routes>
      {GeneralRoutes.map((item, idx) => (
        <Route key={idx} path={item.path} element={<item.element />} />
      ))}
      {
        appState.isConnectedWallet &&
        UserRoutes.map((item, idx) => (
        <Route key={idx} path={item.path} element={<item.element />} />
        ))
      }
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouterList;
