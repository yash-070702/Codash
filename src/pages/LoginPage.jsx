import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Logo from "../components/Common/Logo";
import { login } from "../services/operations/authAPI";
import { toast } from "react-toastify"; 

const LoginPage = ({ currentPage, setCurrentPage }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const rememberMe = watch("rememberMe");

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      const { email, password, rememberMe } = JSON.parse(savedCredentials);
      setValue("email", email);
      setValue("password", password);
      setValue("rememberMe", rememberMe);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    
    // Validate required fields
    if (!data.email || !data.password) {
      toast.error("Please fill out all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Handle remember me functionality
      if (data.rememberMe) {
        // Save credentials to localStorage
        const credentialsToSave = {
          email: data.email,
          password: data.password,
          rememberMe: true
        };
        localStorage.setItem("rememberedCredentials", JSON.stringify(credentialsToSave));
      } else {
        // Remove saved credentials if remember me is unchecked
        localStorage.removeItem("rememberedCredentials");
      }
      
      // Dispatch login action
      dispatch(login(data.email, data.password, navigate));
      
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl h-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] lg:max-h-[calc(100vh-4rem)] rounded-2xl sm:rounded-3xl lg:rounded-4xl border-2 border-white flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center p-8 xl:p-12 text-white">
            <div className="mb-6 xl:mb-8">
              <h1 className="text-2xl xl:text-4xl font-bold mb-2">
                Welcome Back
              </h1>
              <h2 className="text-3xl xl:text-5xl font-bold mb-4">
                Continue your <br />
                <span className="text-purple-300">
                  coding journey
                </span> with <br />
                Smart insights.
              </h2>
              <p className="text-purple-100 text-base xl:text-lg mb-6 xl:mb-8 max-w-md">
                Unlock insights into your coding journey — start with a single
                login.
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 xl:top-20 right-10 xl:right-20 w-24 xl:w-32 h-24 xl:h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 xl:bottom-20 left-10 xl:left-20 w-20 xl:w-24 h-20 xl:h-24 bg-indigo-400/20 rounded-full blur-lg"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
              <div onClick={() => navigate("/")} className="flex items-center justify-center mb-4 lg:mb-6 cursor-pointer">
                <Logo />
              </div>

              {/* Navigation - Stack on mobile */}
              <nav className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-6 lg:mb-8">
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base"
                >
                  Home
                </button>
                <button className="text-purple-400 border-b-2 border-purple-400 pb-1 text-sm lg:text-base">
                  Log In
                </button>
                <button
                  onClick={() => setCurrentPage && setCurrentPage("signup")}
                  className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base"
                >
                  Join
                </button>
                <button
                  onClick={() => navigate("/about-us")}
                  className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base"
                >
                  About Us
                </button>
              </nav>
            </div>

            {/* Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-700/50">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 text-center">
                Welcome back!
                <br />
                <span className="text-base lg:text-lg font-normal text-gray-400">
                  Sign in to your account
                </span>
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm lg:text-base ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-purple-500'
                    }`}
                  />
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm lg:text-base ${
                      errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-purple-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-400 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mr-2 rounded accent-purple-500 cursor-pointer" 
                      {...register("rememberMe")}
                    />
                    <span className="select-none">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Remember Me Info */}
                {rememberMe && (
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-xs text-purple-200 flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      Your login credentials will be saved securely for next time
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium mt-6 flex items-center justify-center gap-2 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Signup Link */}
              <p className="text-center text-gray-400 mt-4 lg:mt-6 text-sm lg:text-base">
                Don't have an account?{" "}
                <button
                  onClick={() => setCurrentPage && setCurrentPage("signup")}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;