import React from "react";
import "./App.css";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import AllPosts from "./components/AllPosts";

function App() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <div className="flex">
      <BrowserRouter>
        {isLoggedIn == true ? <Dashboard /> : <Login />}

        <Routes>
          <Route path="/allposts" element={<AllPosts />} />
          <Route path="/user" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
