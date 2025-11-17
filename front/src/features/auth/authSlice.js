// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     register: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     login: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { register, login, logout } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const storedAuth = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : { user: null, token: null };

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth.user,
    token: storedAuth.token,
    isAuthenticated: !!storedAuth.token,
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        })
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
