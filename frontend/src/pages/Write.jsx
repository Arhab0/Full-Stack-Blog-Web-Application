import axios from "axios";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { baseUrl } from "../helper/baseUrl";
import Modal from "../components/Modal";

const Write = () => {
  const [values, setValues] = useState("");
  const [cat, setCat] = useState("");
  const [catId, setCatId] = useState();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true); // State to control modal visibility

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
    ],
  };

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imgUrl = await upload();
    try {
      await axios.post(`${baseUrl}/add-post`, {
        title,
        description: values,
        img: file ? imgUrl : "",
        cat,
        cat_id: catId,
        date: moment(Date.now()).format("YYYY-MM-DD HH-mm-ss"),
      });
      alert("New post has been created");
      navigate("/");
    } catch (err) {
      console.log(err);
      if (err.message === "Request failed with status code 401") {
        alert("Please login first");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    // Show the modal when the component is mounted
    setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    // <div className={`px-6 py-32 ${isModalOpen ? "blur-background" : ""}`}>
    //   <Modal isOpen={isModalOpen} onClose={closeModal} />
    //   <div className="max-w-7xl">
    //     <div className="w-[100%] flex md:flex-row gap-11 flex-col">
    //       {/* editing section */}
    //       <div className="md:w-[70%]">
    //         <input
    //           type="text"
    //           className="p-[10px] mb-2 w-full outline-none"
    //           value={title}
    //           placeholder="Title"
    //           onChange={(e) => {
    //             setTitle(e.target.value);
    //           }}
    //           style={{ border: "1px solid gray" }}
    //         />
    //         <div className="h-[300px] border-1 border-[#b9e7e7]">
    //           <ReactQuill
    //             className="h-full border-none"
    //             theme="snow"
    //             value={values}
    //             onChange={setValues}
    //             modules={modules}
    //           />
    //         </div>
    //       </div>

    //       {/* menu section */}
    //       <div className="md:w-[30%] full flex flex-col">
    //         {/* Public */}
    //         <div
    //           className="flex flex-col w-[230px]"
    //           style={{
    //             border: "1px solid gray",
    //             padding: "5px 10px",
    //             marginBottom: "10px",
    //           }}
    //         >
    //           <h1 className="font-bold md:text-2xl text-lg mb-6">Publish</h1>
    //           <span>
    //             <b>Status: </b>Draft
    //           </span>
    //           <span className="mb-4">
    //             <b>Visbility: </b>Public
    //           </span>
    //           <label htmlFor="file" className="mb-1 font-semibold text-base">
    //             Upload Image
    //           </label>
    //           <input
    //             type="file"
    //             name="file"
    //             id="file"
    //             className="cursor-pointer underline"
    //             onChange={(e) => {
    //               setFile(e.target.files[0]);
    //             }}
    //           />
    //           <div className="mt-2 flex justify-center ">
    //             <button
    //               onClick={handleSubmit}
    //               className="my-3 px-2 w-32 py-2 rounded-md bg-[#b9e7e7] hover:-translate-y-1 duration-200"
    //             >
    //               Publish
    //             </button>
    //           </div>
    //         </div>

    //         {/* Category */}
    //         <div
    //           className="text-teal-600 w-[230px]"
    //           style={{ border: "1px solid gray", padding: "5px 10px" }}
    //         >
    //           <h1 className="font-bold md:text-2xl text-lg text-black mb-5">
    //             Category
    //           </h1>
    //           <div className="flex gap-2">
    //             <input
    //               type="radio"
    //               name="cat"
    //               value="art"
    //               id="art"
    //               checked={cat === "art"}
    //               onChange={(e) => {
    //                 setCat(e.target.value), setCatId(1);
    //               }}
    //             />
    //             <label htmlFor="art">Art</label>
    //           </div>
    //           <div className="flex gap-2">
    //             <input
    //               type="radio"
    //               name="cat"
    //               value="science"
    //               id="science"
    //               checked={cat === "science"}
    //               onChange={(e) => {
    //                 setCat(e.target.value), setCatId(2);
    //               }}
    //             />
    //             <label htmlFor="science">science</label>
    //           </div>
    //           <div className="flex gap-2">
    //             <input
    //               type="radio"
    //               name="cat"
    //               value="technology"
    //               id="technology"
    //               checked={cat === "technology"}
    //               onChange={(e) => {
    //                 setCat(e.target.value), setCatId(3);
    //               }}
    //             />
    //             <label htmlFor="technology">Technology</label>
    //           </div>
    //           <div className="flex gap-2">
    //             <input
    //               type="radio"
    //               name="cat"
    //               value="cinema"
    //               id="cinema"
    //               checked={cat === "cinema"}
    //               onChange={(e) => {
    //                 setCat(e.target.value), setCatId(4);
    //               }}
    //             />
    //             <label htmlFor="cinema">Cinema</label>
    //           </div>
    //           <div className="flex gap-2">
    //             <input
    //               type="radio"
    //               name="cat"
    //               value="design"
    //               id="design"
    //               checked={cat === "design"}
    //               onChange={(e) => {
    //                 setCat(e.target.value), setCatId(5);
    //               }}
    //             />
    //             <label htmlFor="design">Design</label>
    //           </div>
    //           <div className="flex gap-2">
    //             <input
    //               type="radio"
    //               name="cat"
    //               value="food"
    //               id="food"
    //               checked={cat === "food"}
    //               onChange={(e) => {
    //                 setCat(e.target.value), setCatId(6);
    //               }}
    //             />
    //             <label htmlFor="food">Food</label>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className={`px-6 py-32 ${isModalOpen ? "blur-background" : ""}`}>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex flex-col md:flex-row gap-11">
          {/* Editing section */}
          <div className="md:w-2/3 w-full">
            <input
              type="text"
              className="p-2 mb-2 w-full outline-none border border-gray-300"
              value={title}
              placeholder="Title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <div className="h-[300px] border border-[#b9e7e7]">
              <ReactQuill
                className="h-full border-none"
                theme="snow"
                value={values}
                onChange={setValues}
                modules={modules}
              />
            </div>
          </div>

          {/* Menu section */}
          <div className="md:w-1/3 w-full flex flex-col">
            {/* Publish */}
            <div className="flex flex-col border border-gray-300 p-4 mb-4">
              <h1 className="font-bold text-2xl mb-6">Publish</h1>
              <span>
                <b>Status: </b>Draft
              </span>
              <span className="mb-4">
                <b>Visibility: </b>Public
              </span>
              <label htmlFor="file" className="mb-1 font-semibold text-base">
                Upload Image
              </label>
              <input
                type="file"
                name="file"
                id="file"
                className="cursor-pointer underline"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              <div className="mt-2 flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="my-3 px-4 py-2 w-full rounded-md bg-[#b9e7e7] hover:-translate-y-1 duration-200"
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="text-teal-600 border border-gray-300 p-4">
              <h1 className="font-bold text-2xl text-black mb-5">Category</h1>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="cat"
                  value="art"
                  id="art"
                  checked={cat === "art"}
                  onChange={(e) => {
                    setCat(e.target.value);
                    setCatId(1);
                  }}
                />
                <label htmlFor="art">Art</label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="cat"
                  value="science"
                  id="science"
                  checked={cat === "science"}
                  onChange={(e) => {
                    setCat(e.target.value);
                    setCatId(2);
                  }}
                />
                <label htmlFor="science">Science</label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="cat"
                  value="technology"
                  id="technology"
                  checked={cat === "technology"}
                  onChange={(e) => {
                    setCat(e.target.value);
                    setCatId(3);
                  }}
                />
                <label htmlFor="technology">Technology</label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="cat"
                  value="cinema"
                  id="cinema"
                  checked={cat === "cinema"}
                  onChange={(e) => {
                    setCat(e.target.value);
                    setCatId(4);
                  }}
                />
                <label htmlFor="cinema">Cinema</label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="cat"
                  value="design"
                  id="design"
                  checked={cat === "design"}
                  onChange={(e) => {
                    setCat(e.target.value);
                    setCatId(5);
                  }}
                />
                <label htmlFor="design">Design</label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="cat"
                  value="food"
                  id="food"
                  checked={cat === "food"}
                  onChange={(e) => {
                    setCat(e.target.value);
                    setCatId(6);
                  }}
                />
                <label htmlFor="food">Food</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
