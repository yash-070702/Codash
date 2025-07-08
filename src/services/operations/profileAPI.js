import { toast } from "react-toastify";
import { apiConnector } from "../apiconnector";
import { userEndpoints } from "../apis";
import { logout } from "./authAPI";
import { setUser } from "../../slices/profileSlice";
const { DELETE_PROFILE , UPDATE_PROFILE } = userEndpoints;

// Basic profile deletion
export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    if (!token) {
      toast.error("🔐 You need to be logged in to delete your profile.");
      return;
    }

    console.log("🔐 Token being sent:", `Bearer ${token}`);

    const toastId = toast.loading("Deleting your profile...", {
      position: "top-center",
      autoClose: false,
      theme: "dark",
    });

    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE, undefined, {
        Authorization: `Bearer ${token}`,
      });

      console.log("✅ API delete profile response:", response);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete profile");
      }

      toast.update(toastId, {
        render: "🗑️ Profile deleted successfully! Redirecting to homepage...",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Slightly increased delay for better UX before redirect
      setTimeout(() => {
        dispatch(logout(navigate));
      }, 1800);

    } catch (error) {
      console.log("❌ DELETE_PROFILE_API ERROR:", error);

      let errorMessage = "Failed to delete profile. Please try again.";

      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 401:
            errorMessage = "🔐 Session expired. Please login again.";
            break;
          case 403:
            errorMessage = "❌ You don't have permission to delete this profile.";
            break;
          case 404:
            errorMessage = "❓ Profile not found. It may have already been deleted.";
            break;
          case 500:
            errorMessage = "🔧 Server error. Please try again later.";
            break;
          default:
            errorMessage = `❌ ${error.response.data?.message || errorMessage}`;
        }
      } else if (error.request) {
        errorMessage = "🌐 Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = `⚠️ ${error.message}`;
      }

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });

      if (error.response?.status === 401) {
        setTimeout(() => {
          dispatch(logout(navigate));
        }, 2000);
      }

    } finally {
      // In case you manage global loading later, handle cleanup here
      // dispatch(setLoading(false));
    }
  };
}


export function updateProfile(token, formData, navigate) {
  return async (dispatch) => {
    // Input validation
    if (!token) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    if (!formData || Object.keys(formData).length === 0) {
      toast.error("No profile data provided for update.");
      return;
    }

    // Validate required fields
    if (!formData._id || !formData._rev) {
      toast.error("Missing required profile identifiers. Please refresh and try again.");
      return;
    }

    const toastId = toast.loading("Updating your profile...", {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    });

    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE, formData, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      console.log("UPDATE_PROFILE_API Response:", response);

      // Enhanced response validation
      if (!response?.data) {
        throw new Error("Invalid response format received from server");
      }

      if (!response.data.success) {
        throw new Error(response.data.message || "Profile update failed");
      }

      // Validate required response data
      if (!response.data.updatedUserDetails) {
        throw new Error("Updated user details not received from server");
      }

      const updatedUser = response.data.updatedUserDetails;
      
      // Generate fallback image with better error handling
      const userImage = updatedUser.image || 
        `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
          updatedUser.fullName || 'User'
        )}`;

      // Dispatch updated user data
      dispatch(setUser({ 
        ...updatedUser, 
        image: userImage 
      }));

      // Success notification
      toast.update(toastId, {
        render: "Profile updated successfully! 🎉",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate to profile page
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error("UPDATE_PROFILE_API Error:", error);
      
      // Extract meaningful error message
      let errorMessage = "Could not update profile. Please try again.";
      
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to update this profile.";
      } else if (error.response?.status === 409) {
        errorMessage = "Document has been modified. Please refresh and try again.";
      } else if (error.response?.status === 422) {
        errorMessage = "Invalid profile data. Please check your inputs.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Error notification
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Optional: Dispatch error action for global error handling
      // dispatch(setError(errorMessage));
    }
  };
}




