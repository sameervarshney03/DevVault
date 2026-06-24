import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import RepoDetail from "./components/repo/RepoDetail";
import RepoLayout from "./components/repo/RepoLayout";
import NewRepository from "./components/repo/NewRepository";
import NotFound from "./components/NotFound";

// Future imports for issues and prs will go here
import IssueTracker from "./components/issue/IssueTracker";
import PullRequests from "./components/pr/PullRequests";

import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let userIdFromStorage = localStorage.getItem("userId");

    // Sanitize corrupted values
    if (userIdFromStorage === "undefined" || userIdFromStorage === "null" || userIdFromStorage === "") {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      userIdFromStorage = null;
    }

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
      navigate("/auth");
    }

    if (userIdFromStorage && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { 
      path: "/", 
      element: <AppLayout />,
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "/profile", element: <Profile /> },
        { path: "/create", element: <NewRepository /> },
        { 
          path: "/repo/:id", 
          element: <RepoLayout />,
          children: [
            { path: "", element: <RepoDetail /> },
            { path: "issues", element: <IssueTracker /> },
            { path: "pulls", element: <PullRequests /> }
          ]
        },
        { path: "*", element: <NotFound /> },
      ]
    },
  ]);

  return element;
};

export default ProjectRoutes;