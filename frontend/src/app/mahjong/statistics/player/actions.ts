"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongPlayerStatistics } from "@/types/mahjong";

export async function fetchPlayerStatistics(
  category?: string
): Promise<MahjongPlayerStatistics[]> {
  try {
    const response = await api.get(`/mahjong/statistics/player`, {
      params: { category },
    });
    // console.log(response.data);
    if (!response.data) return [];
    else return response.data as MahjongPlayerStatistics[];
  } catch (err) {
    console.log((err as Error).message);
    return [];
  }
}
