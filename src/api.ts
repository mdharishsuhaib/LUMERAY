import axios from "axios";

const API = axios.create({
  baseURL: "https://lumeray.onrender.com/",
});

// Add a request interceptor to attach the token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default API;

const API_URL = "https://lumeray.onrender.com/";
