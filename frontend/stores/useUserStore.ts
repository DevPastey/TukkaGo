import { create } from "zustand";
import axiosInstance from "../lib/axios";
import axios from "axios";
import { FormShape, LoginProps } from "@/types/types";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

interface UserStore {
  user: FormShape | null; // Replace `any` with your User type if you have one
  loading: boolean;
  checkingAuth: boolean;
  errors: Record<string, string>;
  signup: (data: FormShape) => Promise<boolean>;
  login: (data: LoginProps) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;

  accessToken: string | null;
  setAccessToken: (token: string | null) => Promise<void>;
  loadAccessToken: () => Promise<void>;
  submitting: boolean;

};



export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  errors: {},
  accessToken: null,
  submitting: false,
  

  setErrors: (errors: any) => set(() => ({ errors })),

  signup: async ({name, email, password, confirmPassword}: FormShape) => {
    set({submitting: true});
    

    try {
      const res = await axiosInstance.post("/auth/signup", {name, email, password, confirmPassword});

      console.log(res);

      const {user, accessToken} = res.data;

      set({user: user, accessToken: accessToken, submitting: false});
        
      await get().setAccessToken(accessToken);

      Alert.alert("Success", "Sign up successful");
      return true; // ✅ success
    } catch (error: any) {
      set({ submitting: false});

      // ✅ Type-safe error handling
      if (axios.isAxiosError(error)) {
          const message =
          (error.response?.data as { message?: string })?.message ||
          "Signup failed.";
          Alert.alert("Error", message);
      } else if (error instanceof Error) {
          Alert.alert("Error", error.message);
      } else {
          Alert.alert("Error", "An unexpected error occurred.");
      }

      return false; // ❌ failed
    } finally {
      set({ submitting: false });
    }
  },

  login: async({email, password}: LoginProps) => {
    set({submitting: true});
    
    try {
      const res = await axiosInstance.post("/auth/login", {email, password} );

      const {user, accessToken} = res.data;
     
      set({user: user, accessToken: accessToken, submitting: false});
      
      await get().setAccessToken(accessToken);
      await get().checkAuth();
      
      Alert.alert("Success", "Login successful");
      router.replace("/");
      return true;

    } catch (error) {
      set({loading: false});
    
    if (axios.isAxiosError(error)) {
      const message =
      (error.response?.data as { message?: string })?.message ||
      "Invalid email or password";
      Alert.alert("Error", message);
    } else if (error instanceof Error) {
        Alert.alert("Error", error.message);
    } else {
        Alert.alert("Error", "An unexpected error occurred.");
    }
    
    return false;
    }
  },


  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
  
      await SecureStore.deleteItemAsync("accessToken");
  
      set({ user: null, accessToken: null });
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message);
    }
  },

  checkAuth: async () => {
    set({checkingAuth: true});
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({user: res.data, checkingAuth: false});
    } catch (error) {
      set({checkingAuth: false, user: null});
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({checkingAuth: true});

    try {
      const res = await axiosInstance.post("auth/refresh-token", {});
      set({ checkingAuth: false});
      return res.data;
    } catch (error) {
      set({ user: null, checkingAuth: false});  
      throw error;
    }
  },

  setAccessToken: async (token) => {
    if (token) {
      await SecureStore.setItemAsync("accessToken", token);
    } else {
      await SecureStore.deleteItemAsync("accessToken");
    }
  
    set({ accessToken: token });
  },
  
  loadAccessToken: async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    set({ accessToken: token });
  },
  

}));


//axios interceptors for refreshing access token

let refreshPromise: any = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if(error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        };

        //Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        //If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }

    }

    return Promise.reject(error);
  }
);