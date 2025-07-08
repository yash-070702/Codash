const BASE_URL = import.meta.env.VITE_API_URL

export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
};

export const userEndpoints = {
  GET_PROFILE: BASE_URL + "/user/getProfile",
  UPDATE_PROFILE: BASE_URL + "/user/updateUserDetails",
  DELETE_PROFILE: BASE_URL + "/user/deleteAccount",
  CHANGE_PASSWORD: BASE_URL + "/user/changePassword",
};

export const platformEndpoints = {
  GET_CODECHEF_DETAILS: BASE_URL + "/platform/getCodeChefDetails",
  GET_CODEFORCES_DETAILS: BASE_URL + "/platform/getCodeforcesDetails",
  GET_LEETCODE_DETAILS: BASE_URL + "/platform/getLeetCodeDetails",    
  GET_GFG_DETAILS: BASE_URL + "/platform/getGfgDetails",
  GET_HACKERRANK_DETAILS: BASE_URL + "/platform/getHackerRankDetails",
};

