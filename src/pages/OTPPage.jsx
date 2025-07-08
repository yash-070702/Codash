import React, { useState, useRef, useEffect } from "react";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Added missing import
import { signUp, sendOtp } from "../services/operations/authAPI";
import Logo from "../components/Common/Logo";

const OTPInput = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef(null);
  
  // Added missing imports
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signupData, loading } = useSelector((state) => state.auth);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      fullName,
      userName,
      email,
      password,
      confirmPassword,
    } = signupData;
    
    // Join OTP array to string
    const otpString = otp.join("");
    dispatch(signUp(fullName, userName, email, password, confirmPassword, otpString, navigate));
  };

  const handleOnChange = (value, index) => {
    const newOTP = [...otp];
    newOTP[index] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(index - 1);
    else setActiveOTPIndex(index + 1);

    setOtp(newOTP);
  };

  const handleOnKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveOTPIndex(index - 1);
    }
  };

  const handleOnFocus = (index) => {
    setActiveOTPIndex(index);
  };

  const handleResendOTP = () => {
    if (!signupData?.email) {
      toast.error("Email not found. Please restart the signup process.");
      return;
    }
    
    setIsResending(true);
    setTimeLeft(60);
    
    // Call the actual resend OTP API
    dispatch(sendOtp(signupData.email, navigate))
      .then(() => {
        setIsResending(false);
        toast.success("OTP resent successfully!");
      })
      .catch(() => {
        setIsResending(false);
        toast.error("Failed to resend OTP. Please try again.");
      });
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      handleOnSubmit({ preventDefault: () => {} }); // Call the actual submit handler
    } else {
      toast.error("Please enter a complete 6-digit OTP");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login"); // or wherever your login page is
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Check if signupData exists
  if (!signupData) {
    return (
      <div className="h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No signup data found</p>
          <button 
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 pt-6 sm:pt-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Logo/>
          </div>

          <button 
            onClick={handleBackToLogin}
            className="flex items-center text-blue-200 hover:text-white transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">Back to login</span>
          </button>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* OTP Card */}
          <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-blue-500/20 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Verify Your Email
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-1">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-blue-400 font-medium text-sm sm:text-base break-all">
                {signupData.email}
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-3 sm:mb-4 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3 px-2 sm:px-0">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    ref={index === activeOTPIndex ? inputRef : null}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-slate-700/50 border-2 rounded-lg text-white focus:outline-none transition-all duration-200 touch-manipulation ${
                      activeOTPIndex === index
                        ? "border-blue-500 bg-slate-700/70 scale-105"
                        : otp[index]
                        ? "border-blue-400 bg-slate-700/60"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                    onChange={(e) => handleOnChange(e.target.value, index)}
                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                    onFocus={() => handleOnFocus(index)}
                    value={otp[index]}
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={otp.join("").length !== 6 || loading}
              className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-white transition-all duration-200 text-sm sm:text-base touch-manipulation ${
                otp.join("").length === 6 && !loading
                  ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-slate-700 cursor-not-allowed"
              }`}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            {/* Resend Section */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-xs sm:text-sm mb-3">
                Didn't receive the code?
              </p>

              {timeLeft > 0 ? (
                <p className="text-slate-500 text-xs sm:text-sm">
                  Resend code in <span className="font-medium">{timeLeft}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="flex items-center justify-center mx-auto text-blue-400 hover:text-blue-300 active:text-blue-500 transition-colors text-xs sm:text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-500/10 active:bg-blue-500/20 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex-shrink-0 pb-6 sm:pb-8">
        <div className="text-center px-4">
          <p className="text-blue-200 text-xs sm:text-sm">
            Need help?{" "}
            <a
              href="#"
              className="text-white hover:underline active:text-blue-300 transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPInput;