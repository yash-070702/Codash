import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import AboutUs from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFoundPage from "./pages/PageNotFound.jsx";
import OTPInput from "./pages/OTPPage.jsx";
import Auth from "./pages/Auth.jsx";
import PrivateRoute from "./components/PrivateRoute.js";
import PublicRoute from "./components/PublicRoute.js";
import LeetCode from "./components/dashboard/LeetCode.jsx";
import CodeForces from "./components/dashboard/CodeForces.jsx";
import CodeChef from "./components/dashboard/CodeChef.jsx";
import Gfg from "./components/dashboard/Gfg.jsx";
import HackerRank from "./components/dashboard/HackerRank.jsx";
import Overview from "./components/dashboard/Overview.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "./services/operations/authAPI";
import {
  getTokenFromLocalStorage,
  getUserFromLocalStorage,
} from "./utils/localStorageUtils.js";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      const user = getUserFromLocalStorage();
      const token = getTokenFromLocalStorage();

      if (!user || !token) {
        logout(dispatch, navigate);
      }
    }, 60000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [dispatch, navigate]);
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              {" "}
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />{" "}
              {/* this is your layout with sidebar and <Outlet /> */}
            </PrivateRoute>
          }
        >
          {/* Nested routes */}
          <Route index element={<Overview />} />
          <Route path="leetcode" element={<LeetCode />} />
          <Route path="codeforces" element={<CodeForces />} />
          <Route path="codechef" element={<CodeChef />} />
          <Route path="gfg" element={<Gfg />} />
          <Route path="hackerrank" element={<HackerRank />} />
        </Route>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        {/* Add more routes as needed */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/verify-email" element={<OTPInput />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
};

export default App;
