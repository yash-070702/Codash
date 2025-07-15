import {createSlice} from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  if (Date.now() > parsed.expiry) {
    localStorage.removeItem("user");  // Session expired - remove data
    return null;
  }

  return parsed.user;
}


const initialState={
    user: getUserFromLocalStorage() || null,
    loading:false,
}

const profileSlice =createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser(state,action){
            state.user=action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
          },
    },
    
});
export const {setUser,setLoading}=profileSlice.actions;
export default profileSlice.reducer;