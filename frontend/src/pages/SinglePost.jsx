import { useEffect, useState } from "react";
import editLogo from "../img/edit.png";
import deleteLogo from "../img/delete.png";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { FaUser } from "react-icons/fa";
import { baseUrl } from "../helper/baseUrl";
import { MdOutlineSort } from "react-icons/md";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
const SinglePost = () => {
  const [post, setPost] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [originalComments, setOriginalComments] = useState([]);
  const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(true);
  const [commentId, setCommentId] = useState(0);
  const [isEditOn, setIsEditOn] = useState(false);
  const [editedComment, setEditComment] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const postId = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const getComments = async () => {
    const res = await axios.get(`${baseUrl}/getComments/${postId}`);
    setOriginalComments(res.data);
    sortAndSetComments(res.data, sortOrder);
    console.log(res.data);
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/${postId}`);
        setPost(res.data);
        localStorage.setItem("username_", res.data.username);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      const res = await axios.post(`${baseUrl}/deletePost/${params.id}`);
      let message = res.data.message;
      Swal.fire({
        title: "Success!",
        text: message,
        icon: "success",
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/addComment`, {
        comment,
        commentedAt: moment(Date.now()).format("YYYY-MM-DD HH-mm-ss"),
        post_id: postId,
        user_id: user?.id,
      });
      console.log(res);
      getComments();
      setComment("");
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    sortAndSetComments(originalComments, newSortOrder);
  };

  const sortAndSetComments = (commentsArray, order) => {
    let sortedComments = [...commentsArray];
    if (order === "newest") {
      sortedComments.sort(
        (a, b) => new Date(b.commentedAt) - new Date(a.commentedAt)
      );
    } else if (order === "oldest") {
      sortedComments.sort(
        (a, b) => new Date(a.commentedAt) - new Date(b.commentedAt)
      );
    }
    setComments(sortedComments);
  };

  useEffect(() => {
    sortAndSetComments(originalComments, sortOrder);
  }, [originalComments, sortOrder]);

  const deleteComment = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/DeleteComment/${id}`);
      let message = res.data.message;
      Swal.fire({
        title: "Success!",
        text: message,
        icon: "success",
      });
      getComments();
    } catch (err) {
      console.log(err);
    }
  };

  const editComment = async (id) => {
    try {
      const res = await axios.put(`${baseUrl}/editingComment/${id}`, {
        comment: editedComment,
      });
      console.log(res);
      setIsEditOn(!isEditOn);
      getComments();
      editedComment("");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="px-6 py-32">
      <div className="max-w-7xl">
        <div className="w-[100%] flex md:flex-row gap-11 flex-col">
          <div className="md:w-[70%] w-full">
            <img
              className="w-full md:h-auto rounded-md object-cover"
              src={`../upload/${post.postImg}`}
              alt=""
            />
            <div className="flex items-center gap-4 mt-3">
              {post.userImg ? (
                <img
                  src={`../upload/${post.userImg}`}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
              ) : (
                <FaUser />
              )}
              <div>
                <span className="font-bold text-[20px]">{post.username}</span>
                <p className="text-sm">posted {moment(post.date).fromNow()}</p>
              </div>
              {isLoggedIn && user.username === post.username && (
                <div className="flex items-center gap-1">
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
              )}
            </div>
            <div className="mt-9">
              <h1 className="font-bold text-2xl mb-9">{post.title}</h1>
              <div
                className="md:text-xl text-lg post-description overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words text-justify"
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
            </div>

            <div className="flex flex-col">
              <div className="font-extrabold text-xl mt-11">
                Total comments {comments.length}
              </div>
              <div className="flex justify-center items-center w-full bg-white">
                {isLoggedIn ? (
                  <div className="mt-6 mr-11">
                    <textarea
                      placeholder="Add your comment..."
                      className="p-2 focus:outline-1 focus:outline-blue-500 font-bold border-[0.1px] resize-none h-[120px] border-[#9EA5B1] rounded-md md:w-[60vw] w-full"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmitComment}
                        className="text-sm font-semibold absolute bg-[#4F46E5] w-fit text-white py-2 rounded px-3"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                ) : (
                  <h1 className="font-bold mt-6">
                    Please login first to comment...
                  </h1>
                )}
              </div>

              {comments.length > 1 && (
                <div className="mt-20 flex gap-3 items-center">
                  <label
                    htmlFor="sortOrder"
                    className="block mb-2 text-sm font-medium text-nowrap text-gray-700"
                  >
                    <span className="flex items-center gap-1">
                      <MdOutlineSort className="text-[25px]" />
                      Sort by
                    </span>
                  </label>
                  <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="border p-2 mr-2 w-36 md:w-auto outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
              )}

              <div className="mt-10">
                {comments.map((item) => (
                  <div key={item.id} className="my-7">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div>
                          {item.img ? (
                            <img
                              src={`../upload/${item.img}`}
                              className="w-[40px] h-[40px] ml-3 rounded-full"
                              alt=""
                            />
                          ) : (
                            <FaUser className="w-[30px] ml-6 h-[30px]" />
                          )}
                        </div>
                        <div className="font-bold">{item.username}</div>
                        <p className="text-gray-500 text-sm mr-11 flex items-center">
                          {moment(item.commentedAt).fromNow()}{" "}
                          {item.edited?.data?.[0] === 1 ? (
                            <p className="ml-2">( edited )</p>
                          ) : (
                            ""
                          )}
                        </p>
                      </div>
                      {(isLoggedIn == true && user.id === item.user_id) ||
                      localStorage.getItem("username_") === user.username ? (
                        <div className="relative">
                          <BsThreeDotsVertical
                            className="cursor-pointer"
                            onClick={() => {
                              setIsCommentMenuOpen(!isCommentMenuOpen);
                              setCommentId(item.id);
                            }}
                          />
                          {commentId === item.id ? (
                            isCommentMenuOpen === true ? (
                              <div
                                className="absolute"
                                style={{ right: "4px", top: "18px" }}
                              >
                                <ul
                                  className="bg-[#f9f9f9] rounded-md shadow-lg border border-gray-200 text-gray-600"
                                  style={{
                                    padding: "10px",
                                    height: "auto",
                                    width: "90px",
                                    transition: "all 0.3s ease-in-out",
                                  }}
                                >
                                  <li
                                    className="hover:underline cursor-pointer mb-2 flex items-center"
                                    onClick={() => {
                                      deleteComment(item.id);
                                    }}
                                  >
                                    <RiDeleteBin6Line />{" "}
                                    <p className="ml-2">Delete</p>
                                  </li>
                                  {user.id === item.user_id && (
                                    <li
                                      className="hover:underline cursor-pointer flex items-center"
                                      onClick={() => {
                                        setIsEditOn(true);
                                        setIsCommentMenuOpen(
                                          !isCommentMenuOpen
                                        );
                                        setEditComment(item.comment);
                                      }}
                                    >
                                      <MdEdit /> <p className="ml-2">Edit</p>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {isEditOn === true && commentId === item.id ? (
                      <div>
                        <input
                          type="text"
                          className="ml-[70px] mt-1 w-[90%] bg-white overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words text-justify border-b-[1px] border-gray-300 focus:border-gray-500 outline-none transition-colors duration-300"
                          value={editedComment}
                          onChange={(e) => {
                            setEditComment(e.target.value);
                          }}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div></div>
                          <div className="flex items-center gap-2">
                            <p
                              className="cursor-pointer"
                              onClick={() => {
                                setIsEditOn(!isEditOn);
                                getComments();
                              }}
                            >
                              Cancel
                            </p>
                            <button
                              onClick={() => {
                                editComment(item.id);
                              }}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <input
                        style={{ outline: "none" }}
                        type="text"
                        className="ml-[70px] mt-1 bg-white overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words text-justify"
                        value={item.comment}
                        disabled
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-[30%] w-full md:-mt-6">
            <Menu cat={post.cat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
