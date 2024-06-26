// import { useEffect, useState } from "react";
// import axios from "axios";
// import { baseUrl } from "../helper/baseUrl";
// import { useStateContext } from "../context/ContextProvider";
// import Swal from "sweetalert2";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [usersPerPage] = useState(5);
//   const { activeMenu } = useStateContext();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/GetAllUsers`);
//       if (res.data.length === 0) {
//         console.log(res.data);
//         setError("No user available");
//       } else {
//         setError("");
//       }
//       setUsers(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const indexOfLastPost = currentPage * usersPerPage;
//   const indexOfFirstPost = indexOfLastPost - usersPerPage;
//   const currentUsers = users.slice(indexOfFirstPost, indexOfLastPost);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const handleDeActivate = (userId) => {
//     axios.put(`${baseUrl}/DeActivateUser/${userId}`).then((res) => {
//       var message = res.data.message;
//       Swal.fire({
//         title: "success!",
//         text: message,
//         icon: "success",
//       });
//       setTimeout(() => {
//         window.location.reload();
//       }, 6000);
//     });
//   };

//   const handleReActivate = (userId) => {
//     axios.put(`${baseUrl}/ReActivateUser/${userId}`).then((res) => {
//       var message = res.data.message;
//       Swal.fire({
//         title: "success!",
//         text: message,
//         icon: "success",
//       });
//       setTimeout(() => {
//         window.location.reload();
//       }, 6000);
//     });
//   };

//   return (
//     <div
//       className={`${
//         activeMenu ? "pl-[280px]" : "pl-[100px]"
//       } pt-8 overflow-y-auto`}
//     >
//       <h1 className="font-bold md:text-4xl sm:text-xl">Users</h1>
//       <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
//         <table className="w-full text-sm text-left rtl:text-right text-black border-collapse border border-gray-300">
//           <thead className="text-xs font-bold uppercase bg-gray-50 text-black">
//             <tr>
//               <th scope="col" className="px-6 py-3 border border-gray-300">
//                 Id
//               </th>
//               <th scope="col" className="px-6 py-3 border border-gray-300">
//                 Img
//               </th>
//               <th scope="col" className="px-6 py-3 border border-gray-300">
//                 username
//               </th>
//               <th scope="col" className="px-6 py-3 border border-gray-300">
//                 email
//               </th>
//               <th scope="col" className="px-6 py-3 border border-gray-300">
//                 Total post
//               </th>
//               <th scope="col" className="px-6 py-3 border border-gray-300">
//                 IsActive
//               </th>
//               <th scope="col" className="px-6 py-3 border border-gray-300">
//                 Active / DeActive
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentUsers.map((post) => (
//               <tr key={post.post_id} className="border border-gray-300">
//                 <td className="px-6 py-4 border border-gray-300">{post.id}</td>
//                 <td className="px-6 py-4 border border-gray-300">
//                   {post.img == null ? (
//                     <p>no img</p>
//                   ) : (
//                     <img
//                       src={`../upload/${post.img}`}
//                       className="w-[55px] h-[55px] rounded-xl"
//                     />
//                   )}
//                 </td>
//                 <td className="px-6 py-4 border border-gray-300">
//                   {post.username}
//                 </td>
//                 <td className="px-6 py-4 border border-gray-300">
//                   {post.email}
//                 </td>
//                 <td className="px-6 py-4 border border-gray-300">
//                   {post.total_post}
//                 </td>
//                 <td className="px-6 py-4 border cursor-pointer border-gray-300">
//                   {post.isActive?.data?.[0] === 1 ? (
//                     <p className="bg-green-400 text-center rounded-lg px-5 py-2">
//                       Active
//                     </p>
//                   ) : (
//                     <p className="bg-red-500 text-center rounded-lg px-5 py-2">
//                       Disabled
//                     </p>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 border cursor-pointer underline border-gray-300">
//                   {post.isActive?.data?.[0] === 1 ? (
//                     <p
//                       className="text-center px-5 py-2"
//                       onClick={() => {
//                         handleDeActivate(post.id);
//                       }}
//                     >
//                       DeActivate
//                     </p>
//                   ) : (
//                     <p
//                       className="text-center px-5 py-2"
//                       onClick={() => {
//                         handleReActivate(post.id);
//                       }}
//                     >
//                       Activate
//                     </p>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex justify-center my-5">
//           <ul className="flex space-x-2">
//             {Array.from({
//               length: Math.ceil(users.length / usersPerPage),
//             }).map((_, index) => (
//               <li key={index}>
//                 <button
//                   onClick={() => paginate(index + 1)}
//                   className={`px-4 py-2 border ${
//                     currentPage === index + 1
//                       ? "bg-gray-400 rounded-md text-white"
//                       : "bg-white text-gray-400 rounded-md"
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       {error && <p className="text-red-500 mt-4">{error}</p>}
//     </div>
//   );
// };

// export default Users;

import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../helper/baseUrl";
import { useStateContext } from "../context/ContextProvider";
import Swal from "sweetalert2";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const { activeMenu } = useStateContext();
  const [usernameFilter, setUsernameFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/GetAllUsers`);
      if (res.data.length === 0) {
        console.log(res.data);
        setError("No user available");
      } else {
        setError("");
      }
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = () => {
    let filtered = users;
    if (usernameFilter) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(usernameFilter.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on filter
  };

  const indexOfLastPost = currentPage * usersPerPage;
  const indexOfFirstPost = indexOfLastPost - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeActivate = (userId) => {
    axios.put(`${baseUrl}/DeActivateUser/${userId}`).then((res) => {
      var message = res.data.message;
      Swal.fire({
        title: "Success!",
        text: message,
        icon: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 6000);
    });
  };

  const handleReActivate = (userId) => {
    axios.put(`${baseUrl}/ReActivateUser/${userId}`).then((res) => {
      var message = res.data.message;
      Swal.fire({
        title: "Success!",
        text: message,
        icon: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 6000);
    });
  };

  return (
    <div
      className={`${
        activeMenu ? "pl-[280px]" : "pl-[100px]"
      } pt-8 overflow-y-auto`}
    >
      <h1 className="font-bold md:text-4xl sm:text-xl">Users</h1>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Filter by username"
          value={usernameFilter}
          onChange={(e) => setUsernameFilter(e.target.value)}
          className="border p-2 mr-2 sm:w-48 w-[160px]"
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
                Username
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Email
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Total Post
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                IsActive
              </th>
              <th scope="col" className="px-6 py-3 border border-gray-300">
                Active / DeActive
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="border border-gray-300">
                <td className="px-6 py-4 border border-gray-300">{user.id}</td>
                <td className="px-6 py-4 border border-gray-300">
                  {user.img == null ? (
                    <p>No img</p>
                  ) : (
                    <div className="w-[80px] h-[60px]">
                      <img
                        src={`../upload/${user.img}`}
                        className="w-full h-[60px] rounded-md"
                        alt="User"
                      />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  {user.username}
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  {user.total_post}
                </td>
                <td className="px-6 py-4 border border-gray-300">
                  {user.isActive?.data?.[0] === 1 ? (
                    <p className="bg-green-400 text-center cursor-default rounded-lg px-5 py-2">
                      Active
                    </p>
                  ) : (
                    <p className="bg-red-500 text-center rounded-lg cursor-default px-5 py-2">
                      Disabled
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 border underline border-gray-300">
                  {user.isActive?.data?.[0] === 1 ? (
                    <p
                      className="text-center px-5 py-2 cursor-pointer"
                      onClick={() => handleDeActivate(user.id)}
                    >
                      DeActivate
                    </p>
                  ) : (
                    <p
                      className="text-center px-5 py-2 cursor-pointer"
                      onClick={() => handleReActivate(user.id)}
                    >
                      Activate
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center my-5">
          <ul className="flex space-x-2">
            {Array.from({
              length: Math.ceil(filteredUsers.length / usersPerPage),
            }).map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 border ${
                    currentPage === index + 1
                      ? "bg-gray-400 rounded-md text-white"
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

export default Users;
