import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  Menu,
  Search,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { logout } from "../../services/operations/authAPI";

const Header = ({
  setSidebarOpen,
  isUserDropdownOpen,
  setIsUserDropdownOpen,
}) => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDashboard = () => {
    navigate("/dashboard");
    setIsUserDropdownOpen(false);
  };

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest(".user-dropdown")) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);
  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-400" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-3xl font-semibold">Welcome ! 
            {" "}
            {user.fullName}</h1>
            <p className="text-sm text-gray-400">
              Consistency is your superpower...
            </p>
          </div>
        </div>
        <div className="relative -translate-x-5 z-100 user-dropdown">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-full p-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getUserInitials(user.fullName)
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 min-w-48 bg-slate-800/95 backdrop-blur-lg rounded-lg border border-slate-700/50 shadow-xl py-2">
              <div className="px-4 py-2 border-b border-slate-700/50">
                <p className="text-sm font-medium text-white">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={handleDashboard}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => dispatch(logout(navigate))}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mb-6 md:hidden">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Here"
            className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
