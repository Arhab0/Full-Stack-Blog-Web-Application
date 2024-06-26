import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../helper/baseUrl";
import { useStateContext } from "../../context/ContextProvider";
import moment from "moment";
import { Link } from "react-router-dom";

const CinemaPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const { activeMenu } = useStateContext();
  const [authorFilter, setAuthorFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/AdminGetCinemaPost`);
      if (res.data.length === 0) {
        setError("No post available");
      } else {
        setError("");
      }
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = () => {
    let filtered = posts;
    if (authorFilter) {
      filtered = filtered.filter((post) =>
        post.username.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page on filter
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className={`${
        activeMenu ? "pl-[280px]" : "pl-[100px]"
      } pt-8 overflow-y-auto`}
    >
      <h1 className="font-bold md:text-4xl sm:text-xl">Cinema</h1>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Filter by author"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="border p-2 mr-2 sm:w-52 w-[160px]"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
        <table className="w-full text-sm text-left rtl:text-right text-black border-collapse border border-gray-300">
          <thead className="text-xs font-bold uppercase bg-gray-50 text-black">
            <tr>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Id
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Img
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Author
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Title
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Category
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Date
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                IsActive
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.post_id} className="border border-gray-300">
                <td className="px-6 py-4 border border-gray-300">
                  {post.post_id}
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  <img
                    className="w-[80px] h-[60px] rounded-md"
                    src={`../upload/${post.post_img}`}
                    alt="Post img"
                  />
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  {post.username}
                </td>
                <td className="px-6 py-4 border text-nowrap border-gray-300">
                  {post.title.substring(0, 20)}...
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  {post.category}
                </td>
                <td className="px-6 py-4 border text-nowrap border-gray-300">
                  {moment(post.date).fromNow()}
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  {post.PostIsActive?.data?.[0] === 1 ? (
                    <p className="bg-green-400 cursor-default text-center rounded-lg px-5 py-2">
                      Active
                    </p>
                  ) : (
                    <p className="bg-red-500 cursor-default text-center rounded-lg px-5 py-2">
                      Disabled
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  <Link to={`/post/${post.post_id}`}>
                    <p className="underline cursor-pointer">View</p>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center gap-6 items-center my-5">
          Showing {currentPosts.length} posts out of {filteredPosts.length}
          <ul className="flex space-x-2">
            {Array.from({
              length: Math.ceil(filteredPosts.length / postsPerPage),
            }).map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 border ${
                    currentPage === index + 1
                      ? "bg-gray-400 rounded-md text-black"
                      : "bg-white text-gray-400 rounded-md"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CinemaPosts;
