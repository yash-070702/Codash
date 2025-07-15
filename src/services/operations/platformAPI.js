import { toast } from "react-toastify";
import { apiConnector } from "../apiconnector";
import { platformEndpoints } from "../apis";

const {
  GET_GFG_DETAILS,
  GET_CODECHEF_DETAILS,
  GET_CODEFORCES_DETAILS,
  GET_LEETCODE_DETAILS,
  GET_HACKERRANK_DETAILS,
} = platformEndpoints;

export const getLeeCodeDetails = async (username, token) => {
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      `${GET_LEETCODE_DETAILS}/${username}`,
      null,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET_LEETCODE_DETAILS API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Failed to fetch LeetCode details"
      );
    }

    result = response?.data;
    console.log("GET_LEETCODE_DETAILS API RESPONSE............", result);
  } catch (error) {
    console.log("GET_LEETCODE_DETAILS API ERROR............", error);

    // Enhanced error handling with specific messages
    let errorMessage = "Failed to fetch LeetCode details";

    if (error.response?.status === 404) {
      errorMessage = `LeetCode user '${username}' not found`;
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests. Please try again later";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server error. Please try again later";
    } else if (error.message) {
      errorMessage = error.message;
    } else if (!navigator.onLine) {
      errorMessage = "No internet connection. Please check your network";
    }

    toast.error(errorMessage);
  }

  return result;
};

export const getGFGDetails = async (username, token) => {
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      `${GET_GFG_DETAILS}/${username}`,
      null,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET_GFG_DETAILS API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch GFG details");
    }

    result = response?.data;
    console.log("GET_GFG_DETAILS API RESPONSE............", result);
  } catch (error) {
    console.log("GET_GFG_DETAILS API ERROR............", error);

    // Enhanced error handling with specific messages
    let errorMessage = "Failed to fetch GFG details";

    if (error.response?.status === 404) {
      errorMessage = `GFG user '${username}' not found`;
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests. Please try again later";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server error. Please try again later";
    } else if (error.message) {
      errorMessage = error.message;
    } else if (!navigator.onLine) {
      errorMessage = "No internet connection. Please check your network";
    }

    toast.error(errorMessage);
  }

  return result;
};


export const getCodeChefDetails = async (username, token) => {
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      `${GET_CODECHEF_DETAILS}/${username}`,
      null,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET_CODECHEF_DETAILS API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch GFG details");
    }

    result = response?.data;
    console.log("GET_CODECHEF_DETAILS API RESPONSE............", result);
  } catch (error) {
    console.log("GET_CODECHEF_DETAILS API ERROR............", error);

    // Enhanced error handling with specific messages
    let errorMessage = "Failed to fetch GFG details";

    if (error.response?.status === 404) {
      errorMessage = `GFG user '${username}' not found`;
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests. Please try again later";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server error. Please try again later";
    } else if (error.message) {
      errorMessage = error.message;
    } else if (!navigator.onLine) {
      errorMessage = "No internet connection. Please check your network";
    }

    toast.error(errorMessage);
  }

  return result;
};
