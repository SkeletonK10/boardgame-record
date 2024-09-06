import axios from "axios";
import { cookies } from "next/headers";

const REFRESH_URL = `/auth/refresh`;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
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
    config.sent = true;
    const refresh = cookies().get("refresh")?.value;
    const secondaryResponse = await api.post(REFRESH_URL, { refresh });
    const { access } = (secondaryResponse.data as any).data;
    if (access) {
      cookies().set("access", access);
      config.headers = {
        authorization: access,
      };
    }
    return api(config);
  }
);
