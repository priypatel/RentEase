import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      {/* ✅ Add ToastContainer here (visible globally) */}
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      /> */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        theme="light"
        transition={Zoom}
        toastStyle={{
          background: "white",
          borderRadius: "14px",
          padding: "12px 16px",
          border: "1px solid #e0f2e9",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      />
    </Provider>
  </React.StrictMode>
);
