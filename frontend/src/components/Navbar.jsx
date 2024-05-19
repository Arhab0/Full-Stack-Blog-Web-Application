import React, { useEffect, useState } from "react";
import Logo from "../img/logo.png";
import { Link } from "react-router-dom";
import { FaBars, FaUser } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    await axios.post("http://localhost:3000/logout").then((res) => {
      dispatch(clearUser());
      alert(res.data.message);
    });
  };

  const [toggle, setToggle] = useState(false);
  return (
    <div className="fixed top-0 left-0 z-[3] bg-white right-0">
      <div className="md:px-6 px-4 py-1 max-w-7xl relative mx-auto flex items-center justify-between">
        <div className="logo">
          <Link to="/">
            <img
              src={Logo}
              onClick={() => setToggle(false)}
              className="w-[90px] h-[80px]"
              alt="blog_logo"
            />
          </Link>
        </div>
        <div className="md:flex hidden gap-3 items-center">
          <Link to="/?cat=art">
            <h1 className="hover:-translate-y-1 duration-200 font-semibold text-[17px]">
              Art
            </h1>
          </Link>
          <Link to="/?cat=science">
            <h1 className="hover:-translate-y-1 duration-200 font-semibold text-[17px]">
              Science
            </h1>
          </Link>
          <Link to="/?cat=technology">
            <h1 className="hover:-translate-y-1 duration-200 font-semibold text-[17px]">
              Technology
            </h1>
          </Link>
          <Link to="/?cat=cinema">
            <h1 className="hover:-translate-y-1 duration-200 font-semibold text-[17px]">
              Cinema
            </h1>
          </Link>
          <Link to="/?cat=design">
            <h1 className="hover:-translate-y-1 duration-200 font-semibold text-[17px]">
              Design
            </h1>
          </Link>
          <Link to="/?cat=food">
            <h1 className="hover:-translate-y-1 duration-200 font-semibold text-[17px]">
              Food
            </h1>
          </Link>
          {isLoggedIn && (
            <span className="flex items-center gap-1.5 hover:-translate-y-1 duration-200 ">
              <span className={`${isLoggedIn ? "block" : "hidden"}`}>
                <FaUser className="text-teal-600 cursor-pointer" />
              </span>
              <span className="text-teal-600 font-bold cursor-pointer">
                {user?.username}
              </span>
            </span>
          )}

          {isLoggedIn ? (
            <span
              onClick={handleLogout}
              className="text-teal-600 font-bold cursor-pointer"
            >
              Logout
            </span>
          ) : (
            <Link
              className="text-teal-600 font-bold cursor-pointer"
              to="/login"
            >
              Login
            </Link>
          )}
          <span
            className="rounded-full bg-[#b9e7e7] w-[50px] h-[50px] flex justify-center items-center
              hover:w-[50px] hover:h-[50px] hover:bg-white hover:text-teal-600 hover:border-[1px]
              hover:border-teal-700
            "
          >
            <Link to="/write">Write</Link>
          </span>
        </div>

        <div className="md:hidden pr-5">
          {toggle ? (
            <IoCloseSharp
              onClick={() => setToggle(!toggle)}
              className="cursor-pointer  text-[25px]"
            />
          ) : (
            <FaBars
              onClick={() => setToggle(!toggle)}
              className="cursor-pointer text-[19px]"
            />
          )}
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in ${
            toggle ? "left-0" : "-left-full"
          } top-[80px]  absolute w-full h-screen bg-black text-white`}
        >
          <Link onClick={() => setToggle(false)} to="/">
            <h1 className="font-semibold text-[17px]  px-5 my-8">Home</h1>
          </Link>
          <Link onClick={() => setToggle(false)} to="/?cat=art">
            <h1 className="font-semibold text-[17px]  px-5 my-9">Art</h1>
          </Link>
          <Link onClick={() => setToggle(false)} to="/?cat=science">
            <h1 className="font-semibold text-[17px]  px-5 my-9">Science</h1>
          </Link>
          <Link onClick={() => setToggle(false)} to="/?cat=technology">
            <h1 className="font-semibold text-[17px]  px-5 my-9">Technology</h1>
          </Link>
          <Link onClick={() => setToggle(false)} to="/?cat=cinema">
            <h1 className="font-semibold text-[17px]  px-5 my-9">Cinema</h1>
          </Link>
          <Link onClick={() => setToggle(false)} to="/?cat=design">
            <h1 className="font-semibold text-[17px] px-5 my-9">Design</h1>
          </Link>
          <Link onClick={() => setToggle(false)} to="/?cat=food">
            <h1 className="font-semibold text-[17px]  px-5 my-9">Food</h1>
          </Link>
          <span className="text-teal-600 font-bold cursor-pointer block px-5 my-9">
            {user?.username}
          </span>
          {isLoggedIn ? (
            <span
              onClick={() => setToggle(false)}
              className="text-teal-600 font-bold cursor-pointer"
            >
              <p className="px-5" onClick={handleLogout}>
                Logout
              </p>
            </span>
          ) : (
            <Link
              className="text-teal-600 font-bold cursor-pointer px-5 my-9"
              to="/login"
            >
              Login
            </Link>
          )}

          <span
            onClick={() => setToggle(false)}
            className="rounded-full bg-teal-600 w-[50px] h-[50px] absoulte ml-4 my-6 flex justify-center items-center
              hover:w-[50px] hover:h-[50px] hover:bg-white hover:text-teal-600 hover:border-[1px]
              hover:border-teal-700
            "
          >
            <Link onClick={() => setToggle(false)} to="/write">
              Write
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
