import axios from "axios";

const API = axios.create({
  baseURL: "https://lumeray.onrender.com/api", // ✅ FIXED
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default API;