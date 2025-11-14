import axios from "axios";
import dotenv from "dotenv";
import * as secureStore from "expo-secure-store";

dotenv.config({});

const axiosInstance = axios.create({
    baseURL: process.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
});




// Add a request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const token = await secureStore.getItemAsync("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default axiosInstance;