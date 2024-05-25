import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "tw-elements-react/dist/css/tw-elements-react.min.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store.js";
import { ContextProvider } from "./context/ContextProvider.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import FoodPosts from "./components/Posts/FoodPosts.jsx";
import TechnologyPosts from "./components/Posts/TechnoloyPosts.jsx";
import SciencePosts from "./components/Posts/SciencePosts.jsx";
import CinemaPosts from "./components/Posts/CinemaPosts.jsx";
import DesignPosts from "./components/Posts/DesignPosts.jsx";
import ArtPosts from "./components/Posts/ArtPosts.jsx";
import Users from "./components/Users.jsx";
import SinglePost from "./components/SinglePost.jsx";
import PendingPosts from "./components/Posts/PendingPosts.jsx";
import ApprovePost from "./components/Posts/ApprovePost.jsx";
import Login from "./components/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/artpost",
        element: <ArtPosts />,
      },
      {
        path: "/foodpost",
        element: <FoodPosts />,
      },
      {
        path: "/technologypost",
        element: <TechnologyPosts />,
      },
      {
        path: "/sciencepost",
        element: <SciencePosts />,
      },
      {
        path: "/cinemapost",
        element: <CinemaPosts />,
      },
      {
        path: "/designpost",
        element: <DesignPosts />,
      },
      {
        path: "/user",
        element: <Users />,
      },
      {
        path: "/post/:id",
        element: <SinglePost />,
      },
      {
        path: "/pendingpost",
        element: <PendingPosts />,
      },
      {
        path: "/approvepost/:id",
        element: <ApprovePost />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </ContextProvider>
  </React.StrictMode>
);
