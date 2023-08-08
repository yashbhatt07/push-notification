import React from "react";
import { Route, Routes } from "react-router-dom";
import LogIn from "../LogIn";
import SuperAdmin from "../DashBoard/SuperAdmin";
import Admin from "../DashBoard/Admin";
const Public = () => {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/logout" element={<LogIn />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/admin/:id" element={<Admin />} />
      <Route path="/superadmin" element={<SuperAdmin />} />
      <Route path="*" element={<LogIn />} />
      {/* <Route path="*||/admin/* || /superadmin/*" element={<LogIn />} /> */}
    </Routes>
  );
};

export default Public;
