import React from "react";
import "./App.css";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import ArtPosts from "./components/Posts/ArtPosts";
import FoodPosts from "./components/Posts/FoodPosts";
import TechnologyPosts from "./components/Posts/TechnoloyPosts";
import SciencePosts from "./components/Posts/SciencePosts";
import DesignPosts from "./components/Posts/DesignPosts";
import CinemaPosts from "./components/Posts/CinemaPosts";
import SinglePost from "./components/SinglePost";
import PendingPosts from "./components/Posts/PendingPosts";
import ApprovePost from "./components/Posts/ApprovePost";

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <div className="flex">
      <BrowserRouter>
        {isLoggedIn == true ? <Dashboard /> : <Login />}

        <Routes>
          <Route path="/artpost" element={<ArtPosts />} />
          <Route path="/foodpost" element={<FoodPosts />} />
          <Route path="/technologypost" element={<TechnologyPosts />} />
          <Route path="/sciencepost" element={<SciencePosts />} />
          <Route path="/cinemapost" element={<CinemaPosts />} />
          <Route path="/designpost" element={<DesignPosts />} />
          <Route path="/user" element={<Users />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/pendingpost" element={<PendingPosts />} />
          <Route path="/approvepost/:id" element={<ApprovePost />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
