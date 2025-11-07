import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token automatically for protected routes
axiosInstance.interceptors.request.use((config) => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default axiosInstance;
