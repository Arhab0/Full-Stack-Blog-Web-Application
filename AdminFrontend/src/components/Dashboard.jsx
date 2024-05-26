/* eslint-disable react/no-unescaped-entities */
import { useSelector } from "react-redux";
import { useStateContext } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../helper/baseUrl";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserCheck, FaUserSlash } from "react-icons/fa";
import TotalPostImg from "../assets/write.png";
import ActivePostImg from "../assets/ActivePostImg.png";
import { MdOutlinePending } from "react-icons/md";
import { TbArticleOff } from "react-icons/tb";
const Dashboard = () => {
  const { activeMenu } = useStateContext();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [totalUser, setTotalUser] = useState(0);
  const [totalActiveUser, setTotalActiveUser] = useState(0);
  const [totalDeActivateUsers, setTotalDeActivateUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalActivePosts, setTotalActivePosts] = useState(0);
  const [totalDeActivatePost, setTotalDeActivatePost] = useState(0);
  const [totalPendingPosts, setTotalPendingPosts] = useState(0);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    axios.get(`${baseUrl}/userscount`).then((res) => {
      setTotalUser(res.data.TotalUsers);
    });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}/activeuserscount`).then((res) => {
      setTotalActiveUser(res.data.TotalActiveUsers);
    });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}/deactivateuserscount`).then((res) => {
      setTotalDeActivateUsers(res.data.TotalDeActivatedUsers);
    });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}/postscount`).then((res) => {
      setTotalPosts(res.data.TotalPosts);
    });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}/activepostscount`).then((res) => {
      setTotalActivePosts(res.data.TotalActivePosts);
    });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}/rejectedpostscount`).then((res) => {
      setTotalDeActivatePost(res.data.TotalDeActivatePosts);
    });
  }, []);
  useEffect(() => {
    axios.get(`${baseUrl}/pendingPostCount`).then((res) => {
      setTotalPendingPosts(res.data.PendingPost);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenSize < 768;
  if (isMobile && activeMenu) {
    return null;
  }
  return (
    <div className={`${activeMenu ? "pl-[255px]" : "pl-[60px]"}  w-full`}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg drop-shadow-2xl w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.username}!
          </h1>
          <p className="mt-4 text-gray-600">
            We're glad to have you back. Here's a quick overview of your
            dashboard:
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-blue-100 rounded-lg">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                  <FaUser />
                </span>
                <div className="ml-4">
                  <p className="font-semibold text-blue-700">Total Users</p>
                  <p className="text-blue-500 font-bold">{totalUser}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-100 rounded-lg">
                <span className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <FaUserCheck />
                </span>
                <div className="ml-4">
                  <p className="font-semibold text-green-700">
                    Total Active Users
                  </p>
                  <p className="text-green-500 font-bold">{totalActiveUser}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-red-100 rounded-lg">
                <span className="flex-shrink-0 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <FaUserSlash />
                </span>
                <div className="ml-4">
                  <p className="font-semibold text-red-700">
                    Total Deactivated Users
                  </p>
                  <p className="text-red-500 font-bold">
                    {totalDeActivateUsers}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-blue-100 rounded-lg">
                <span className="flex-shrink-0 w-10 h-10  text-white rounded-full flex items-center justify-center">
                  <img src={TotalPostImg} className="w-16" />
                </span>
                <div className="ml-4">
                  <p className="font-semibold text-blue-700">Total Posts</p>
                  <p className="text-blue-500 font-bold">{totalPosts}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-100 rounded-lg">
                <span className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <img src={ActivePostImg} className="w-16" />
                </span>
                <div className="ml-4">
                  <p className="font-semibold text-green-700">
                    Total Active Posts
                  </p>
                  <p className="text-green-500 font-bold">{totalActivePosts}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-red-100 rounded-lg">
                <span className="flex-shrink-0 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <TbArticleOff />
                </span>
                <div className="ml-4">
                  <p className="font-semibold text-red-700">
                    Total Rejected Posts
                  </p>
                  <p className="text-red-500 font-bold">
                    {totalDeActivatePost}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-6 mb-7">
            <div className="flex items-center p-4 bg-yellow-100 rounded-lg w-[349px]">
              <span className="flex-shrink-0 w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                <MdOutlinePending />
              </span>
              <div className="ml-4">
                <p className="font-semibold text-yellow-700">
                  Total Pending Posts
                </p>
                <p className="text-yellow-500 font-bold">{totalPendingPosts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
