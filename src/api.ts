import axios from "axios";

const API = axios.create({
  baseURL: "https://lumeray.onrender.com/api"
});

export default API;