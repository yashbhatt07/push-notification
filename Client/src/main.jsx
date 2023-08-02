import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Public from "./Routes/routes.jsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:7000/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Public />
  </BrowserRouter>
);
