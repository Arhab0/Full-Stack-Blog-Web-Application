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
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn && user.role_id === 2) {
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
        if (Object.keys(res.data).length == 1) {
          if (res.data.message === "You have banned from this website") {
            Swal.fire({
              title: "Error!",
              text: "You have banned from this website",
              icon: "error",
            });
          } else {
            setError(res.data.message);
          }
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
      });
  };
  return (
    <div className="flex items-center justify-center flex-col h-screen bg-gray-200 p-9 overflow-hidden">
      <h1 className="text-3xl font-bold text-teal-700 mb-8">Login</h1>
      <form className="flex flex-col gap-5 bg-white p-6  w-full max-w-md rounded-lg shadow-md">
        <input
          type="text"
          name="username"
          placeholder="Enter your name"
          className="border-b border-gray-300 p-3 placeholder-gray-500 outline-none w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="border-b border-gray-300 p-3 placeholder-gray-500 outline-none w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/resetPassword">
          <p className="text-blue-800 text-end -mb-11">Forget Password?</p>
        </Link>
        {error && (
          <p className="text-red-700 font-semibold text-center">{error}</p>
        )}
        <button
          onClick={handleSubmit}
          className="bg-teal-700 text-white p-3 border-none mt-4
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
