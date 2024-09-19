"use server";

import { api } from "@/lib/axiosInterceptor";

export async function fetchPlayerStatistics(category?: string) {
  try {
    const response = await api.get(`/mahjong/statistics/player`, {
      params: { category },
    });
    // console.log(response.data);
    if (!(response.data as any).data) return [];
    else return (response.data as any).data;
  } catch (err) {
    console.log((err as Error).message);
    return [];
  }
}
