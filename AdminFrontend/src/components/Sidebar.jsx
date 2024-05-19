import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/authSlice";
import { baseUrl } from "../helper/baseUrl";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await axios.post(`${baseUrl}/logout`).then((res) => {
      dispatch(clearUser());
      alert(res.data.message);
    });
  };
  return (
    <div className="flex h-screen">
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-800 text-white transition-all duration-300 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className={`${isOpen ? "block" : "hidden"} text-lg font-bold`}>
              Logo
            </h1>
            <button onClick={toggleSidebar} className="text-2xl">
              {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
          <nav className="flex-grow">
            <ul className="space-y-4 px-4">
              <li
                className={`${isOpen ? "hover:bg-gray-700" : ""} p-2 rounded`}
              >
                <Link to="/allposts">
                  <span className={`${isOpen ? "inline" : "hidden"}`}>
                    posts
                  </span>
                </Link>
              </li>
              <li
                className={`${isOpen ? "hover:bg-gray-700" : ""} p-2 rounded`}
              >
                <Link to="/user">
                  <span className={`${isOpen ? "inline" : "hidden"}`}>
                    Users
                  </span>
                </Link>
              </li>
              <li
                className={`${isOpen ? "hover:bg-gray-700" : ""} p-2 rounded`}
              ></li>
            </ul>
          </nav>
        </div>
        <div className="px-4 py-2">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full ${
              isOpen ? "hover:bg-gray-700" : ""
            } p-2 rounded transition-all duration-300`}
          >
            <span className={`${isOpen ? "inline" : "hidden"}`}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
