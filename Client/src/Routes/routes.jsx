import React from "react";
import { Route, Routes } from "react-router-dom";
import LogIn from "../Components/LogIn";
import Admin from "../Components/DashBoard/Admin";
import SuperAdmin from "../Components/DashBoard/SuperAdmin";

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
