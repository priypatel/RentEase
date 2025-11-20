import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
// import dashboardReducer from "./slices/dashboardSlice";
import propertyReducer from "./slices/propertySlice";
import userReducer from "./slices/userSlice";
import rentalRequestReducer from "./slices/rentalRequestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // dashboard: dashboardReducer,
    properties: propertyReducer,
    user: userReducer,
    rentalRequest: rentalRequestReducer,
  },
});

export default store;
