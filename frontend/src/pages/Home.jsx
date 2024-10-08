import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { baseUrl } from "../helper/baseUrl";
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const cat = useLocation().search;

  useEffect(() => {
    fetchData();
  }, [cat, error]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [cat, currentPage]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/posts${cat}`);
      if (res.data.length === 0) {
        console.log(res.data);
        setError("No post available");
      } else {
        setError("");
      }
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const handleSearch = async (e) => {
    let searchKey = e.target.value;
    try {
      if (searchKey) {
        const res = await axios.get(`${baseUrl}/search/${searchKey}`);
        setPosts(res.data);
      } else {
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // calculating last post index
  const indexOfLastPost = currentPage * postsPerPage;
  // calculating first post index
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-4 py-24 md:px-6 md:py-32">
      <div className="max-w-7xl mx-auto">
        <span>
          {error && (
            <p className="font-bold md:text-4xl text-xl py-20 text-center">
              {error}
            </p>
          )}
        </span>
        <input
          type="text"
          name=""
          id=""
          placeholder="Search article"
          className="block mx-auto mb-11 outline-none py-3 px-2 w-full max-w-[400px] rounded-lg border border-gray-300"
          onChange={handleSearch}
        />
        {currentPosts.map((post) => (
          <div className="relative mb-10" key={post.id}>
            <div
              className={`flex flex-col md:flex-row ${
                post.id % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-6 md:gap-x-[80px]`}
            >
              <div className="flex-2 relative">
                <Link to={`/post/${post.id}`}>
                  <img
                    src={`../upload/${post.img}`}
                    className="w-full max-w-[430px] mx-auto hover:scale-95 object-cover duration-300 hover:drop-shadow-2xl cursor-pointer h-80 rounded"
                    alt=""
                  />
                </Link>
              </div>
              <div className="flex flex-1 pt-2 justify-center md:justify-start text-center md:text-left mt-2">
                <Link to={`/post/${post.id}`}>
                  <h1 className="md:text-3xl text-xl font-bold md:my-0 my-3 hover:drop-shadow-2xl">
                    {post.title}
                  </h1>
                  <p className="md:text-lg mt-5">
                    {getText(post.description).length > 50
                      ? getText(post.description).substring(0, 220)
                      : getText(post.description)}
                    .....
                  </p>
                  <button className="my-3 px-4 py-2 hover:drop-shadow-2xl rounded-md bg-[#b9e7e7] hover:-translate-y-1 duration-200">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <div className="mt-5">
            showing {currentPosts.length} posts out of {posts.length}
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mr-4 bg-gray-200 rounded disabled:opacity-50"
            >
              <FaArrowLeft />
            </button>
            <span className="mr-4 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
