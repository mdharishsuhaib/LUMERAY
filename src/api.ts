import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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

const API_URL = "http://localhost:5000/api";