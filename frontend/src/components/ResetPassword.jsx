/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { baseUrl } from "../helper/baseUrl";

import axios from "axios";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretMessage, setSecretMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    } else {
      navigate("/resetPassword");
    }
  }, [isLoggedIn]);

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !secretMessage.trim()
    ) {
      setError("All fields are required");
      return;
    }

    if (password != confirmPassword) {
      setError("Password didn't match");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Email is not valid");
      return;
    }
    await axios
      .put(`${baseUrl}/resetPassword`, {
        email,
        secretMessage,
        password,
      })
      .then((res) => {
        if (res.data.message === "Invalid email or secret message") {
          setError(res.data.message);
        } else {
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
            title: "Password changed successfully",
          });
          navigate("/login");
        }
      });
  };
  return (
    <div className="flex items-center justify-center flex-col h-screen bg-gray-200 p-9 overflow-hidden">
      <h1 className="text-3xl font-bold text-teal-700 mb-8">Change Password</h1>
      <form className="flex flex-col gap-5 bg-white p-6  w-full max-w-md rounded-lg shadow-md">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="border-b border-gray-300 p-3 placeholder-gray-500 outline-none w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          name="secretMessage"
          placeholder="Enter your secret code"
          className="border-b border-gray-300 p-3 placeholder-gray-500 outline-none w-full"
          value={secretMessage}
          onChange={(e) => setSecretMessage(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="border-b border-gray-300 p-3 placeholder-gray-500 outline-none w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Confirm password"
          className="border-b border-gray-300 p-3 placeholder-gray-500 outline-none w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <p className="text-red-700 font-semibold text-center">{error}</p>
        )}
        <button
          onClick={handleSubmit}
          className="bg-teal-700 text-white p-3 border-none mt-4
          rounded transition-all ease-out duration-200
          hover:-translate-y-1"
        >
          Save Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
