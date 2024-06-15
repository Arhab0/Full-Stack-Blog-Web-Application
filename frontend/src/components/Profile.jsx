import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../helper/baseUrl";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [secretMessage, setSecretMessage] = useState("");
  const [file, setFile] = useState(null);
  const [uImg, setUImg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${baseUrl}/userinfo/${user?.id}`);
      setUsername(res.data.username);
      setGender(res.data.gender);
      setAge(res.data.age);
      setEmail(res.data.email);
      setSecretMessage(res.data.secretMessage);
      setUImg(res.data.img);
    };
    fetchData();
  }, [user?.id]);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(`${baseUrl}/upload`, formData);
      return res.data.filename; // Return the data directly
    } catch (err) {
      console.log(err);
    }
  };

  const updatedData = async () => {
    await axios.get(`${baseUrl}/userinfo/${user?.id}`).then((res) => {
      dispatch(loginUser(res.data));
      return;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const imgUrl = await upload();
    try {
      await axios
        .put(`${baseUrl}/update-user/${user?.id}`, {
          username,
          gender,
          age,
          email,
          secretMessage,
          img: file ? imgUrl : uImg,
        })
        .then((res) => {
          var message = res.data.message;
          Swal.fire({
            title: "success!",
            text: message,
            icon: "success",
            confirmButtonText: "Ok",
          });
        });
      updatedData();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {isLoggedIn == true ? (
        <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
          <main className="w-full min-h-screen py-1 flex items-center justify-center">
            <div className="p-2 md:p-4">
              <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                <h2 className="pl-6 text-2xl text-center font-bold sm:text-xl">
                  User Profile
                </h2>

                <div className="grid max-w-2xl mx-auto mt-8">
                  {uImg == null ? (
                    <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                      <FaUser className=" w-40 h-40 p-3 rounded-full ring-2 ring-indigo-300 " />
                      <div className="flex flex-col space-y-5 sm:ml-8">
                        <label
                          htmlFor="file"
                          className="mb-2 font-semibold text-lg sm:text-start text-center text-gray-700"
                        >
                          Upload Profile Pic
                        </label>
                        <input
                          type="file"
                          name="file"
                          id="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                          onChange={(e) => {
                            setFile(e.target.files[0]);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                      <img
                        className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                        src={`../upload/${uImg}`}
                      />

                      <div className="flex flex-col space-y-5 sm:ml-8">
                        <label
                          htmlFor="file"
                          className="mb-2 font-semibold text-lg sm:text-start text-center text-gray-700"
                        >
                          Change Profile Pic
                        </label>
                        <input
                          type="file"
                          name="file"
                          id="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                          onChange={(e) => {
                            setFile(e.target.files[0]);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                    <div className="mb-2 sm:mb-6">
                      <label htmlFor="" className="text-gray-400 mb-2 text-sm">
                        Username
                      </label>
                      <input
                        type="text"
                        id="usename"
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                      />
                    </div>

                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                      <div className="w-full">
                        <label
                          htmlFor=""
                          className="text-gray-400 mb-2 text-sm"
                        >
                          Gender
                        </label>
                        <input
                          type="text"
                          id="gender"
                          className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                          value={gender}
                          onChange={(e) => {
                            setGender(e.target.value);
                          }}
                        />
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor=""
                          className="text-gray-400 mb-2 text-sm"
                        >
                          Age
                        </label>
                        <input
                          type="number"
                          id="age"
                          className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                          value={age}
                          onChange={(e) => {
                            setAge(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-2 sm:mb-6">
                      <label htmlFor="" className="text-gray-400 mb-2 text-sm">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>

                    <div className="mb-2 sm:mb-6">
                      <label htmlFor="" className="text-gray-400 mb-2 text-sm">
                        Secret Code
                      </label>
                      <input
                        type="text"
                        id="secretMessage"
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        value={secretMessage}
                        onChange={(e) => {
                          setSecretMessage(e.target.value);
                        }}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div>Please login again</div>
      )}
    </div>
  );
};

export default Profile;
