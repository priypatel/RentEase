import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
// import dashboardReducer from "./slices/dashboardSlice";
import propertyReducer from "./slices/propertySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // dashboard: dashboardReducer,
    properties: propertyReducer,
  },
});

export default store;
