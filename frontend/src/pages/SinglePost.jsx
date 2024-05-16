import React, { useEffect, useState } from "react";
import editLogo from "../img/edit.png";
import deleteLogo from "../img/delete.png";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { FaUser } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { baseUrl } from "../helper/baseUrl";

import { useSelector } from "react-redux";

const SinglePost = () => {
  const [post, setPost] = useState({});
  const postId = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

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

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/deletePost/${params.id}`).then((res) => {
        if (res.data.message === "Not authenticated") {
          alert(res.data.message);
        } else if (res.data.message === "Invalid token") {
          alert(res.data.message);
        } else if (
          res.data.message ===
          "This post doesn't belong to you or does not exist"
        ) {
          alert(res.data.message);
        } else {
          alert(res.data.message);
          navigate("/");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="px-6 py-32">
      <div className=" max-w-7xl">
        <div className="w-[100%]  flex md:flex-row gap-11 flex-col">
          {/* content */}
          <div className="md:w-[70%] w-full">
            {/* user */}
            <img
              className="w-full md:h-auto rounded-md object-cover"
              src={`../upload/${post.postImg}`}
              alt=""
            />
            <div className="flex items-center gap-4 mt-3">
              {/* info */}
              {post.userImg && (
                <img
                  src={post.userImg}
                  className="w-[60px] h-[60px] rounded-full"
                  alt=""
                />
              )}
              {post.userImg ? (
                <img
                  src={post.userImg}
                  className="w-[60px] h-[60px] rounded-full"
                  alt=""
                />
              ) : (
                <FaUser />
              )}

              {isLoggedIn ? (
                user.username === post.username ? (
                  <>
                    <div className="flex gap-2">
                      <div>
                        <span className="font-bold text-[20px]">
                          {post.username}
                        </span>
                        <p className="text-sm">
                          posted {moment(post.date).fromNow()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 -mt-5">
                        <Link to={`/updatePost/${post.id}`}>
                          <img className="w-6 h-6" src={editLogo} alt="" />
                        </Link>
                        <img
                          onClick={handleDelete}
                          className="cursor-pointer w-6 h-6"
                          src={deleteLogo}
                          alt=""
                        />
                      </div>
                      {/* <div className='md:ml-[450px] sm:ml-[300px] -ml-[-10px] flex gap-1 items-center'>
                           <MdOutlineRemoveRedEye/> {post.views} views
                          </div> */}
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="font-bold text-[20px]">
                      {post.username}
                    </span>
                    <p className="text-sm">
                      posted {moment(post.date).fromNow()}
                    </p>
                  </div>
                )
              ) : (
                <div>
                  <span className="font-bold text-[20px]">{post.username}</span>
                  <p className="text-sm">
                    posted {moment(post.date).fromNow()}
                  </p>
                </div>
              )}
            </div>
            {/* product info */}
            <div className="mt-9">
              <h1 className="font-bold text-2xl mb-9">{post.title}</h1>
              <div
                className="md:text-xl text-lg post-description overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words text-justify"
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
            </div>
          </div>

          {/* menu */}

          <div className="md:w-[30%] w-full md:-mt-6 ">
            <Menu cat={post.cat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
