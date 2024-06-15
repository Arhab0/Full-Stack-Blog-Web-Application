import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { FaUser } from "react-icons/fa";
import { baseUrl } from "../helper/baseUrl";

import { useStateContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SinglePost = () => {
  const [post, setPost] = useState({});
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const postId = location.pathname.split("/")[2];
  const { activeMenu } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleReActivate = () => {
    axios.put(`${baseUrl}/ReActivatePost/${postId}`).then((res) => {
      var message = res.data.message;
      Swal.fire({
        title: "success!",
        text: message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      GoBack();
    });
  };

  const handleDeActivate = () => {
    axios.put(`${baseUrl}/DeActivatePost/${postId}`).then((res) => {
      var message = res.data.message;
      Swal.fire({
        title: "success!",
        text: message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      GoBack();
    });
  };

  const GoBack = () => {
    navigate(-1);
  };

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
    <div
      className={`text-wrap ${
        activeMenu ? "pl-[280px]" : "pl-[80px]"
      } pt-8 overflow-y-auto`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col md:flex-row gap-11">
          {/* content */}
          <div className="md:w-80% w-full">
            {/* user */}
            <img
              className="w-full md:h-auto rounded-md object-cover"
              src={`../upload/${post.postImg}`}
              alt=""
            />
            <div className="flex items-center gap-4 mt-3">
              {/* info */}

              {post.userImg ? (
                <img
                  src={`../upload/${post.userImg}`}
                  className="w-[60px] h-[60px] rounded-full"
                  alt=""
                />
              ) : (
                <FaUser />
              )}
              <div>
                <span className="font-bold text-[20px]">{post.username}</span>
                <p className="text-sm">posted {moment(post.date).fromNow()}</p>
              </div>
            </div>
            {/* product info */}
            <div className="mt-9">
              <h1 className="font-bold text-2xl mb-9">{post.title}</h1>
              <div
                className="md:text-xl text-lg post-description overflow-x-hidden overflow-y-auto whitespace-pre-wrap text-wrap break-words text-justify"
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end pr-9 my-11">
        <div className="cursor-pointer">
          {post.isActive?.data?.[0] === 1 ? (
            <p
              className="bg-red-500 text-center rounded-lg px-5 py-2"
              onClick={handleDeActivate}
            >
              DeActivate
            </p>
          ) : (
            <p
              className="bg-green-400 text-center rounded-lg px-5 py-2"
              onClick={handleReActivate}
            >
              Activate
            </p>
          )}
        </div>
        <div
          className="cursor-pointer bg-gray-400 text-center rounded-lg px-5 py-2"
          onClick={GoBack}
        >
          Go back
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
