import { useState } from "react";
import axios from "axios";
import { TEInput, TERipple } from "tw-elements-react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../helper/baseUrl";
import Swal from "sweetalert2";

const RegisterAdmin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if any of the fields are empty
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !gender.trim() ||
      age == null
    ) {
      setError("All fields are required");
      return;
    }

    if (gender.toLowerCase() !== "male" && gender.toLowerCase() !== "female") {
      setError(`Invalid gender ${gender}`);
      return;
    }
    if (age < 18) {
      setError(`User must be at least 18 years old`);
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      setError("Email is not valid");
      return;
    }

    await axios
      .post(`${baseUrl}/adminregister`, {
        username,
        email,
        password,
        gender,
        age,
      })
      .then((res) => {
        if (res.data.message === "User already exists") {
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
            title: "Signed up successfully",
          });
          navigate("/");
        }
      });
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-200 p-9 overflow-hidden">
      <h1 className="text-3xl font-bold text-teal-700 mb-8">Register Admin</h1>
      <form
        className="flex flex-col gap-5 bg-white p-6 w-full max-w-md rounded-lg shadow-md mb-8"
        onSubmit={handleSubmit}
      >
        <TEInput
          type="text"
          label="User Name"
          size="lg"
          className="mb-6"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></TEInput>

        <TEInput
          type="text"
          label="User gender"
          size="lg"
          className="mb-6"
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
          }}
        ></TEInput>

        <TEInput
          type="number"
          label="User age"
          size="lg"
          className="mb-6"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
          }}
        ></TEInput>

        <TEInput
          type="email"
          label="User email"
          size="lg"
          className="mb-6"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></TEInput>

        <TEInput
          type="password"
          label="User password"
          size="lg"
          className="mb-6"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></TEInput>

        {error && (
          <p className="text-red-700 font-semibold text-center">{error}</p>
        )}
        {/* <button
          type="submit"
          className="bg-teal-500 font-bold text-white p-3 rounded transition-transform transform hover:scale-105"
        >
          Create Admin
        </button> */}
        <div className="flex items-center justify-center">
          <TERipple rippleColor="light">
            <button
              type="submit"
              className="inline-block text-nowrap rounded bg-primary md:px-36 px-20 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              Register Admin
            </button>
          </TERipple>
        </div>
      </form>
    </div>
  );
};

export default RegisterAdmin;
