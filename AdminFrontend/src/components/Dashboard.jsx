import React from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/authSlice";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="fixed">
        <Sidebar />
      </div>
    </div>
  );
};

export default Dashboard;
