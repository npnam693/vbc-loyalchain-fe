import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import NotFound from "../pages/notFound";
import GeneralRoutes from "./list/GeneralRoutes";

const RouterList = () => {
  return (
    <Routes>
      {GeneralRoutes.map((item, idx) => (
        <Route key={idx} path={item.path} element={<item.element />} />
      ))}

      {/* Use if we have many role in system */}
      {/* <Route path="/user" element={<PrivateRoute roles={[ROLE.User]} />}>
        {UserRoutes.map((item, idx) => (
          <Route key={idx} path={item.path} element={<item.element />} />
        ))}
      </Route> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouterList;
