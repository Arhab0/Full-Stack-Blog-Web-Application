/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../helper/baseUrl";

import axios from "axios";
import { loginUser } from "../store/authSlice";
import Swal from "sweetalert2";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn]);

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(`${baseUrl}/login`, {
        username,
        password,
      })
      .then((res) => {
        const ObjLen = Object.keys(res.data).length;
        if (ObjLen === 1) {
          setError(res.data.message);
        } else {
          if (Object.keys(res.data).length == 1) {
            setError(res.data.message);
          } else {
            dispatch(loginUser(res.data));
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: "success",
              title: "Signed in successfully",
            });
            navigate("/");
          }
        }
      });
  };
  return (
    <div className="flex items-center justify-center flex-col h-screen bg-[#b9e7e7]">
      <h1 className="text-4xl font-bold text-teal-700 mb-11">Login</h1>
      <form className="flex flex-col gap-5 bg-white p-6 w-[400px] rounded">
        <input
          type="text"
          name="username"
          placeholder="Enter your name"
          className=" border-b border-1 border-zinc-600 p-4 placeholder:text-gray-500 outline-none"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className=" border-b border-1 border-zinc-600 p-4 placeholder:text-gray-500 outline-none"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <p className="text-red-700 font-semibold text-center">
          {error == "" ? "" : error}
        </p>
        <button
          onClick={handleSubmit}
          className="bg-teal-700 text-white p-3 border-none
          rounded transition-all ease-out duration-200
          hover:-translate-y-1"
        >
          Login
        </button>

        <span className="text-sm">
          Didn't have account?
          <Link className=" text-blue-800" to="/register">
            {" "}
            Create account
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
