import axios from "axios";
import constants from "expo-constants";
import { getToken } from "./tokenService";

const MODE = constants.expoConfig?.extra?.MODE;

const axiosInstance = axios.create({
    baseURL: MODE === "development" ? "http://localhost:5000/api" : "/api",
});



// Add a request interceptor
// Attach token automatically

axiosInstance.interceptors.request.use((config) => {
  const token = getToken() // OK, no cycle here
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default axiosInstance;