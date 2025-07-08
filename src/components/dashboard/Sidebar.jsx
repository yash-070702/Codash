import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Logo from "../Common/Logo";
import { NavLink } from "react-router-dom";
import { Activity, Settings, X } from "lucide-react";
import GFG from "../../assets/gfg.png";
import HackerRank from "../../assets/hackerrank.png";
import CodeChef from "../../assets/codechef1.png";
import CodeForces from "../../assets/codeforces.png";
import LeetCode from "../../assets/leetcode.png";
import { MdLogout } from "react-icons/md";
import { logout } from "../../services/operations/authAPI";
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const activeClass =
    "bg-indigo-500 rounded-lg p-3 flex items-center gap-3 text-white";
  const inactiveClass =
    "flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg cursor-pointer text-gray-300";

  const getLinkClass = ({ isActive }) =>
    isActive ? activeClass : inactiveClass;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gray-800 p-4 transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <div onClick={() => navigate("/")}>
            <Logo />
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <nav className="space-y-2">
          <div className="text-sm text-gray-400 mb-4">General</div>
          <NavLink to="/dashboard" end className={getLinkClass}>
            <div className="w-8 h-8 bg-indigo-400 rounded flex items-center justify-center">
              <span className="text-sm">📊</span>
            </div>
            <span>Overview</span>
          </NavLink>

          <div className="text-sm text-gray-400 mb-4 mt-6">Platforms</div>

          <NavLink to="/dashboard/leetcode" className={getLinkClass}>
            <img src={LeetCode} alt="leetcode" className="w-5 h-5" />
            <span>LeetCode</span>
          </NavLink>

          <NavLink to="/dashboard/gfg" className={getLinkClass}>
            <img src={GFG} alt="GFG" className="w-5 h-5" />
            <span>GeeksForGeeks</span>
          </NavLink>

          <NavLink to="/dashboard/codechef" className={getLinkClass}>
            <img src={CodeChef} alt="HackerRank" className="w-5 h-5" />
            <span>CodeChef</span>
          </NavLink>

          <NavLink to="/dashboard/hackerrank" className={getLinkClass}>
            <img src={HackerRank} alt="HackerRank" className="w-5 h-5" />
            <span>HackerRank</span>
          </NavLink>
          <NavLink to="/dashboard/codeforces" className={getLinkClass}>
            <img src={CodeForces} alt="CodeForces" className="w-5 h-5" />
            <span>CodeForces</span>
          </NavLink>

          <div className="text-sm text-gray-400 mb-4 mt-6">Settings</div>

          <div
            onClick={() => navigate("/edit-profile")}
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings</span>
          </div>

          <div
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
          >
            <MdLogout className="w-5 h-5 text-gray-400" />
            <span>Logout</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
