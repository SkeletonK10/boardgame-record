"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongPlayerStatistics, MahjongSeasonDto } from "@/types/mahjong";

interface FetchPlayerStatisticsParams {
  isSeason: boolean;
  selectedSeason?: number;
  category?: string;
  start?: string;
  end?: string;
}

export async function fetchPlayerStatistics({
  isSeason,
  selectedSeason,
  category,
  start,
  end,
}: FetchPlayerStatisticsParams): Promise<MahjongPlayerStatistics[]> {
  try {
    console.log(isSeason, selectedSeason);
    const response = isSeason
      ? await api.get(`/mahjong/statistics/player`, {
          params: {
            category,
            season: selectedSeason,
          },
        })
      : await api.get(`/mahjong/statistics/player`, {
          params: {
            category,
            startDate: start,
            endDate: end,
          },
        });
    if (response.status !== 200) {
      console.log((response as any).response);
    }
    // console.log(response.data);
    if (!response.data) return [];
    else return response.data as MahjongPlayerStatistics[];
  } catch (err) {
    console.log((err as Error).message);
    return [];
  }
}

export async function fetchSeasons(): Promise<MahjongSeasonDto[]> {
  try {
    const response = await api.get("/mahjong/season");
    // console.log(response.data);
    if (!response.data) return [];
    else return response.data as MahjongSeasonDto[];
  } catch (err) {
    console.log((err as Error).message);
    return [];
  }
}
