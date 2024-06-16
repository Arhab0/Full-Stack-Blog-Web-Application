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

const SinglePost = () => {
  const [post, setPost] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [originalComments, setOriginalComments] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  const postId = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const getComments = async () => {
    const res = await axios.get(`${baseUrl}/getComments/${postId}`);
    setOriginalComments(res.data);
    sortAndSetComments(res.data, sortOrder);
  };

  useEffect(() => {
    getComments();
  }, [postId]);

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
      Swal.fire({
        title: "Success!",
        text: res.data.message,
        icon: "success",
      });
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
                    className="border p-2 mr-2 w-36 md:w-auto"
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
                      </div>
                      <p className="text-gray-500 text-sm mr-11">
                        {moment(item.commentedAt).fromNow()}
                      </p>
                    </div>
                    <p className="ml-[70px] mt-1">{item.comment}</p>
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
