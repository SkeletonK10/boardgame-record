import axios from "axios";
import { cookies } from "next/headers";

const SIGNIN_URL = `/auth/signin`;
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
    "Content-type": "application/json",
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

    if (
      config.url === REFRESH_URL ||
      (500 <= status && status <= 599) ||
      config.sent
    ) {
      return Promise.reject(err);
    }

    if (status === 401 && config.url !== SIGNIN_URL) {
      config.sent = true;
      const refresh = cookies().get("refresh")?.value;
      const secondaryResponse = await api.post(REFRESH_URL, { refresh });
      const { access } = secondaryResponse.data as any;
      if (access) {
        cookies().set("access", access);
        config.headers = {
          authorization: access,
        };
      }
      return api(config);
    }
    return Promise.resolve(err);
  }
);
