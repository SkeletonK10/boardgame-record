import axios from "axios";
import { cookies } from "next/headers";

const REFRESH_URL = `/auth/refresh`;

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

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const {
      config,
      response: { status },
    } = err;

    if (config.url === REFRESH_URL || status !== 401 || config.sent) {
      return Promise.reject(err);
    }
    const { access } = (await api.post(REFRESH_URL)).data as any;
    if (access) {
      cookies().set("access", access);
      config.headers = {
        authorization: access,
      };
    }
    return api(config);
  }
);
