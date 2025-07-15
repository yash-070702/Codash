import { toast } from "react-toastify";
import { setLoading, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { setUser } from "../../slices/profileSlice";
import { saveUserWithExpiry } from "../../utils/saveUserWithExpiry";
import {saveTokenWithExpiry} from "../../utils/saveTokenWithExpiry";
const { SENDOTP_API, SIGNUP_API, LOGIN_API, LOGOUT_API } = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP to your email...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      console.log("SENDOTP API RESPONSE............", response);

      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.dismiss(toastId);
      toast.success("OTP sent successfully! Please check your email.");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.dismiss(toastId);

      // Handle different error scenarios
      let errorMessage = "Failed to send OTP. Please try again.";

      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const serverMessage =
          error.response.data?.message || error.response.data?.error;

        switch (statusCode) {
          case 400:
            errorMessage =
              serverMessage ||
              "Invalid email address. Please check and try again.";
            break;
          case 404:
            errorMessage = "Email not found. Please check your email address.";
            break;
          case 409:
            errorMessage =
              "User already exists with this email. Please try logging in.";
            break;
          case 429:
            errorMessage =
              "Too many requests. Please wait a moment and try again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              serverMessage || "Something went wrong. Please try again.";
        }
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message) {
        // Custom error message from server
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
    dispatch(setLoading(false));
  };
}

export function signUp(
  fullName,
  userName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating your account...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        fullName,
        userName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.dismiss(toastId);
      toast.success("🎉 Account created successfully! You can now log in.");
      navigate("/auth");
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      toast.dismiss(toastId);

      // Handle different error scenarios
      let errorMessage = "Failed to create account. Please try again.";

      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const serverMessage =
          error.response.data?.message || error.response.data?.error;

        switch (statusCode) {
          case 400:
            if (serverMessage?.toLowerCase().includes("password")) {
              errorMessage =
                "Password requirements not met. Please check and try again.";
            } else if (serverMessage?.toLowerCase().includes("email")) {
              errorMessage =
                "Invalid email format. Please check your email address.";
            } else if (serverMessage?.toLowerCase().includes("otp")) {
              errorMessage =
                "Invalid or expired OTP. Please request a new one.";
            } else if (serverMessage?.toLowerCase().includes("username")) {
              errorMessage =
                "Username already taken. Please choose a different one.";
            } else {
              errorMessage =
                serverMessage || "Please check your information and try again.";
            }
            break;
          case 401:
            errorMessage =
              "Invalid OTP. Please check your email and enter the correct OTP.";
            break;
          case 409:
            errorMessage =
              "An account with this email already exists. Please try logging in.";
            break;
          case 410:
            errorMessage = "OTP has expired. Please request a new one.";
            break;
          case 422:
            errorMessage = "Please fill in all required fields correctly.";
            break;
          case 429:
            errorMessage =
              "Too many signup attempts. Please wait and try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              serverMessage || "Something went wrong. Please try again.";
        }
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message) {
        // Custom error message from server
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // Navigate back to signup only for specific errors
      if (error.response?.status === 401 || error.response?.status === 410) {
        // For OTP related errors, stay on current page or navigate to OTP page
        navigate("/verify-email");
      } else if (error.response?.status !== 409) {
        // Don't navigate back to signup if user already exists
        navigate("/signup");
      }
    }
    dispatch(setLoading(false));
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.dismiss(toastId);
      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));

      saveTokenWithExpiry(response.data.token, 120);
      saveUserWithExpiry(response.data.user, 120);
      navigate(`/dashboard`);
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.dismiss(toastId);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      await apiConnector("POST", LOGOUT_API, {});

      dispatch(setToken(null));
      dispatch(setUser(null));

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.dismiss(toastId);
      toast.success("Logged Out");
      navigate("/");
    } catch (error) {
      console.log("LOGOUT API ERROR............", error);
      toast.dismiss(toastId);
      toast.error("Logout Failed");
    }
    dispatch(setLoading(false));
  };
}

//   export function getPasswordResetToken(email , setEmailSent) {
//     return async(dispatch) => {
//       dispatch(setLoading(true));
//       try{
//         const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})

//         console.log("RESET PASSWORD TOKEN RESPONSE....", response);

//         if(!response.data.success) {
//           throw new Error(response.data.message);
//         }

//         toast.success("Reset Email Sent");
//         setEmailSent(true);
//       }
//       catch(error) {
//         console.log("RESET PASSWORD TOKEN Error", error);
//         toast.error("Your Email is not Registered with us.Please enter a valid email id ");
//       }
//       dispatch(setLoading(false));
//     }
//   }
