import { createSlice } from "@reduxjs/toolkit";

const getTokenFromLocalStorage = () => {
  const stored = localStorage.getItem("token");
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  if (Date.now() > parsed.expiry) {
    localStorage.removeItem("token"); // Session expired - remove token
    return null;
  }

  return parsed.token;
};

const initialState = {
  signupData: null,
  loading: false,
  token: getTokenFromLocalStorage() || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});
export const { setSignupData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
