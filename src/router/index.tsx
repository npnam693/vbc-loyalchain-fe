import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/notFound";
import GeneralRoutes from "./list/GeneralRoutes";

const RouterList = () => {
  return (
    <Routes>
      {GeneralRoutes.map((item, idx) => (
        <Route key={idx} path={item.path} element={<item.element />} />
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouterList;
