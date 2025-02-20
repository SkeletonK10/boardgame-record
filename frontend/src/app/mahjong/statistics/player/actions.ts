"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongPlayerStatistics } from "@/types/mahjong";

export async function fetchPlayerStatistics(
  isSeason: boolean,
  category?: string,
  start?: string,
  end?: string
): Promise<MahjongPlayerStatistics[]> {
  try {
    const response = await api.get(
      `/mahjong/statistics/player${isSeason ? "/season" : ""}`,
      {
        params: {
          category,
          startdate: start,
          enddate: end,
        },
      }
    );
    // console.log(response.data);
    if (!response.data) return [];
    else return response.data as MahjongPlayerStatistics[];
  } catch (err) {
    console.log((err as Error).message);
    return [];
  }
}
