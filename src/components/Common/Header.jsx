import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { IoIosPersonAdd } from "react-icons/io";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { logout } from "../../services/operations/authAPI";
import Logo from "./Logo";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);
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
      <nav className="fixed top-0 left-0 right-0 z-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div onClick={() => navigate("/")} className="cursor-pointer">
              <Logo />
            </div>

            {!user && (
              <>
                <div className="hidden md:flex items-center space-x-8">
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    Get Started
                  </button>
                </div>

                <div className="flex md:hidden items-center space-x-4">
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-gray-300 hover:text-white transition-colors text-xl"
                  >
                    <CiLogin />
                  </button>
                  <button
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    <IoIosPersonAdd />
                  </button>
                </div>
              </>
            )}
            {user && (
              <div className="relative user-dropdown">
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
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
