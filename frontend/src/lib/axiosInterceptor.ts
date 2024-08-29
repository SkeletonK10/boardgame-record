import axios from "axios";
import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = cookies().get("access")?.value;
  config.headers = {
    authorization: accessToken,
  };
  return config;
});
