import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://playtube-bf9m.onrender.com/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});