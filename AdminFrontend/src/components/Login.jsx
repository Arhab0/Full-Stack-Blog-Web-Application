import React, { useEffect, useState } from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { loginUser } from "../../../frontend/src/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../../frontend/src/helper/baseUrl";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(`${baseUrl}/Adminlogin`, {
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
            navigate("/Dashboard");
            console.log("you ar login", username, password);
          }
        }
      });
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <section className="h-screen">
          <div className="h-full">
            {/* <!-- Left column container with background--> */}
            <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
              <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                <img
                  src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                  className="w-full"
                  alt="Sample image"
                />
              </div>

              {/* <!-- Right column container --> */}
              <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                <form>
                  <h1 className="md:text-3xl sm:text-xl font-bold mb-9">
                    Welcome back!
                  </h1>
                  {/* <!-- username input --> */}
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

                  {/* <!--Password input--> */}
                  <TEInput
                    type="password"
                    label="Password"
                    className="mb-6"
                    size="lg"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  ></TEInput>
                  <p className="text-red-700 font-semibold text-center">
                    {error == "" ? "" : error}
                  </p>

                  {/* <!-- Login button --> */}
                  <div className="text-center lg:text-left">
                    <TERipple rippleColor="light">
                      <button
                        onClick={handleSubmit}
                        className="inline-block rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                      >
                        Login
                      </button>
                    </TERipple>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
