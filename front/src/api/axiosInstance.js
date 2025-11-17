import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://172.16.5.17:5005/api",
});

// Automatically attach token
axiosInstance.interceptors.request.use((config) => {
  const authData = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

  if (authData?.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }

  return config;
});

export default axiosInstance;
