// src/api/base.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + "/api",
  
});

export default api;
