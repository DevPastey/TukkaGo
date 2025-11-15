import { useUserStore } from "@/stores/useUserStore";


let accessToken: string | null;
export const setToken = (token: string | null) => {
    accessToken = token;
};

export const getToken = () => accessToken;
  