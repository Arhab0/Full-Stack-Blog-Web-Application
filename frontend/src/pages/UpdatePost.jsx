import axios from "axios";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../helper/baseUrl";
import Swal from "sweetalert2";

const UpdatePost = () => {
  const [values, setValues] = useState("");
  const [cat, setCat] = useState("");
  const [catId, setCatId] = useState();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [pImg, setImg] = useState("");
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];

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

    let imgUrl;
    if (file != null) {
      imgUrl = await upload();
    }
    try {
      await axios
        .put(`${baseUrl}/update-post/${postId}`, {
          title,
          description: values,
          cat_id: catId,
          img: file ? imgUrl : pImg,
        })
        .then((res) => {
          var message = res.data.message;
          Swal.fire({
            title: "success!",
            text: message,
            icon: "success",
            confirmButtonText: "Ok",
          });
        });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [postId]);

  const getData = async () => {
    const res = await axios.get(`${baseUrl}/post/${postId}`);

    setTitle(res.data.title);
    setValues(res.data.description);
    setCat(res.data.cat);
    setImg(res.data.postImg);
    setCatId(res.data.cat_id);
  };
  return (
    <div className={`px-6 py-32 `}>
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

export default UpdatePost;
