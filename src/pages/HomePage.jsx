import React, { useState, useEffect } from "react";
import {
  Zap,
  ArrowRight,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Common/Logo.jsx";
import AnalyticalChart from "../components/HomePage/AnalyticalChart.jsx";
import Features from "../components/HomePage/Features.jsx";
import Platforms from "../components/HomePage/Platforms.jsx";
import Testimonials from "../components/HomePage/Testimonials.jsx";
import Footer from "../components/Common/Footer.jsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify"; // Import toast for notifications
import { logout } from "../services/operations/authAPI.js";
const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [animatedStats, setAnimatedStats] = useState({
    accuracy: 0,
    growth: 0,
    efficiency: 0,
  });

  // Close dropdown when clicking outside
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

  // Animated counter effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedStats((prev) => ({
        accuracy: prev.accuracy < 98 ? prev.accuracy + 1 : 98,
        growth: prev.growth < 85 ? prev.growth + 1 : 85,
        efficiency: prev.efficiency < 92 ? prev.efficiency + 1 : 92,
      }));
    }, 50);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#platforms"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Platforms
              </a>
              <a
                href="#testimonials"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Testimonials
              </a>
              <a
                onClick={() => navigate("/about-us")}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                About Us
              </a>

              {/* User Profile or Auth Buttons */}
              {user ? (
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
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-lg border-t border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-300 hover:text-white"
              >
                Features
              </a>
              <a
                href="#platforms"
                className="block px-3 py-2 text-gray-300 hover:text-white"
              >
                Platforms
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-gray-300 hover:text-white"
              >
                Testimonials
              </a>
              <a
                onClick={() => navigate("/about-us")}
                className="block px-3 py-2 text-gray-300 hover:text-white cursor-pointer"
              >
                About Us
              </a>

              {/* Mobile User Profile or Auth Buttons */}
              {user ? (
                <div className="border-t border-slate-700/50 pt-2">
                  <div className="px-3 py-2 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {User.avatar ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getUserInitials(user.fullName)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-400">{User.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDashboard}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white flex items-center space-x-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => dispatch(logout(navigate))}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/auth")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/auth")}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors mt-2"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="w-10/12 mx-auto">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex mt-10 items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-4 py-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-purple-300">
                      Unified Coding Analytics
                    </span>
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    Master Your
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                      {" "}
                      Coding Journey
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Connect all your coding platforms in one powerful dashboard.
                    Track progress, analyze performance, and unlock your full
                    potential with CoDash.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">
                      {animatedStats.accuracy}%
                    </div>
                    <div className="text-sm text-gray-400">
                      Insight Accuracy
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {animatedStats.growth}%
                    </div>
                    <div className="text-sm text-gray-400">Skill Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-400">
                      {animatedStats.efficiency}%
                    </div>
                    <div className="text-sm text-gray-400">
                      Workflow Efficiency
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {user ? (
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center justify-center space-x-2 font-semibold"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Go to Dashboard</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/auth")}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center justify-center space-x-2 font-semibold"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate("/auth")}
                        className="border border-slate-600 text-white px-8 py-4 rounded-lg hover:border-slate-500 hover:bg-slate-800/50 transition-colors"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Content - Dashboard Preview */}
              <AnalyticalChart />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
        >
          <Features />
        </section>

        {/* Platforms Section */}
        <section id="platforms" className="py-20 px-4 sm:px-6 lg:px-8">
          <Platforms />
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
        >
          <Testimonials />
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Coding Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start tracking your progress across multiple platforms and unlock
              insights that will accelerate your growth as a developer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center justify-center space-x-2 font-semibold"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Go to Dashboard</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center justify-center space-x-2 font-semibold"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate("/auth")}
                    className="border border-slate-600 text-white px-8 py-4 rounded-lg hover:border-slate-500 hover:bg-slate-800/50 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
