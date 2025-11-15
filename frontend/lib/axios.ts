import { useUserStore } from "@/stores/useUserStore";
import axios from "axios";
import constants from "expo-constants";
import * as secureStore from "expo-secure-store";

const MODE = constants.expoConfig?.extra?.MODE;

const axiosInstance = axios.create({
    baseURL: MODE === "development" ? "http://localhost:5000/api" : "/api",
});

const {accessToken} = useUserStore();


// Add a request interceptor
// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;