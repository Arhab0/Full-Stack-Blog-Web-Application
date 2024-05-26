import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowDown } from "react-icons/fa";
import { clearUser } from "../store/authSlice";
import { baseUrl } from "../helper/baseUrl";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import AdminMalePic from "../assets/Admin-Profile-Vector-PNG-Clipart.png";
import AdminFemalePic from "../assets/femaleAdmin.png";
import Swal from "sweetalert2";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [pendingPost, setPendingPost] = useState(0);
  const [isPostsOpen, setIsPostsOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { setActiveMenu } = useStateContext();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setActiveMenu(!isOpen);
    setIsPostsOpen(false);
  };

  const togglePosts = () => {
    setIsPostsOpen(!isPostsOpen);
  };

  const handleLogout = async () => {
    await axios.post(`${baseUrl}/logout`).then((res) => {
      dispatch(clearUser());
      var message = res.data.message;
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
        title: message,
      });
      navigate("/login");
    });
  };

  const GetPendingPostCount = async () => {
    await axios.get(`${baseUrl}/pendingPostCount`).then((res) => {
      setPendingPost(res.data.PendingPost);
    });
  };

  useEffect(() => {
    GetPendingPostCount();
  }, [isOpen]);

  return (
    <div className="flex h-screen fixed">
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-300 text-black transition-all duration-300 flex flex-col justify-between  overflow-y-auto`}
      >
        <div className="relative">
          <div className="flex flex-col justify-center items-center px-4 py-2">
            <button
              onClick={toggleSidebar}
              className="text-2xl absolute top-3 right-3"
            >
              {isOpen ? (
                <AiOutlineClose />
              ) : (
                <AiOutlineMenu
                  style={{
                    marginRight: "9px",
                  }}
                />
              )}
            </button>
            <div className={`${isOpen ? "block" : "hidden"} absolute top-10`}>
              <div className="flex flex-col text-center">
                {user?.gender == "male" ? (
                  <img
                    src={AdminMalePic}
                    className="w-[130px] h-[130px]"
                    alt=""
                  />
                ) : (
                  <img
                    src={AdminFemalePic}
                    className="w-[130px] h-[130px]"
                    alt=""
                  />
                )}
                <h1 className="mt-3 font-bold text-lg">{user?.username}</h1>
              </div>
            </div>
          </div>
          <nav className="flex-grow overflow-y-auto">
            <ul className="space-y-[0.5px] px-4 mt-[210px]">
              <li className={` p-2 rounded`}>
                <button
                  onClick={togglePosts}
                  className="w-full text-left flex items-center"
                >
                  <span
                    className={`${
                      isOpen ? "inline" : "hidden"
                    } inline-flex items-center gap-2`}
                  >
                    Posts{" "}
                    <span className="text-[11px]">
                      <FaArrowDown />
                    </span>
                  </span>
                </button>
                {isPostsOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className=" transition-all duration-300 p-2 rounded"
                      onClick={toggleSidebar}
                    >
                      <Link to="/artpost">
                        <span className={`${isOpen ? "inline" : "hidden"}`}>
                          Art
                        </span>
                      </Link>
                    </li>
                    <li
                      className=" transition-all duration-300 p-2 rounded"
                      onClick={toggleSidebar}
                    >
                      <Link to="/foodpost">
                        <span className={`${isOpen ? "inline" : "hidden"}`}>
                          Food
                        </span>
                      </Link>
                    </li>
                    <li
                      className=" transition-all duration-300 p-2 rounded"
                      onClick={toggleSidebar}
                    >
                      <Link to="/technologypost">
                        <span className={`${isOpen ? "inline" : "hidden"}`}>
                          Technology
                        </span>
                      </Link>
                    </li>
                    <li
                      className=" transition-all duration-300 p-2 rounded"
                      onClick={toggleSidebar}
                    >
                      <Link to="/sciencepost">
                        <span className={`${isOpen ? "inline" : "hidden"}`}>
                          Science
                        </span>
                      </Link>
                    </li>
                    <li
                      className=" transition-all duration-300 p-2 rounded"
                      onClick={toggleSidebar}
                    >
                      <Link to="/designpost">
                        <span className={`${isOpen ? "inline" : "hidden"}`}>
                          Design
                        </span>
                      </Link>
                    </li>
                    <li
                      className=" transition-all duration-300 p-2 rounded"
                      onClick={toggleSidebar}
                    >
                      <Link to="/cinemapost">
                        <span className={`${isOpen ? "inline" : "hidden"}`}>
                          Cinema
                        </span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`p-2 rounded -mt-4`} onClick={toggleSidebar}>
                <Link to="/user">
                  <span className={`${isOpen ? "inline" : "hidden"}`}>
                    Users
                  </span>
                </Link>
              </li>
              <li className={`p-2 rounded -mt-4`} onClick={toggleSidebar}>
                <Link to="/pendingpost">
                  <span className={`${isOpen ? "inline" : "hidden"}`}>
                    Posts Request{" "}
                    <span className="text-sm text-blue-700">
                      {" "}
                      ({pendingPost})
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="px-4 py-2 flex flex-col space-y-4">
          <button
            onClick={() => {
              navigate("/adminregister");
            }}
            className={`flex items-center w-full `}
          >
            <span className={`${isOpen ? "inline" : "hidden"}`}>
              Create Admin
            </span>
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full pb-4`}
          >
            <span className={`${isOpen ? "inline" : "hidden"}`}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
