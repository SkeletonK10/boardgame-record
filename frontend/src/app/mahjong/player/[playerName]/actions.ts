"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongCategory } from "../../dto";
import { MahjongPlayerPageDto } from "./dto";
import { MahjongPlayerStatistics } from "../../statistics/player/dto";

export async function fetchPlayer(playerName: string) {
  try {
    const categories = Object.values(MahjongCategory);

    const recordResponsePromise = categories.map(async (category) => {
      return await api.get(`/mahjong/player/record`, {
        params: {
          playername: playerName,
          category,
        },
      });
    });
    const statisticsResponsePromise = categories.map(async (category) => {
      return await api.get(`/mahjong/statistics/player`, {
        params: {
          playername: playerName,
          category,
        },
      });
    });

    const [recordResponse, statisticsResponse] = await Promise.all([
      Promise.all(recordResponsePromise),
      Promise.all(statisticsResponsePromise),
    ]);

    // console.log(response.data);
    const records = recordResponse.reduce(
      (acc, response, idx) => {
        const category = categories[idx];
        const data = ((response.data as any).data || []).slice(-10);
        return {
          ...acc,
          [category]: data,
        };
      },
      {
        [MahjongCategory.fourPlayer]: [],
        [MahjongCategory.threePlayer]: [],
      }
    );
    const statistics = statisticsResponse.reduce(
      (acc, response, idx) => {
        const category = categories[idx];
        const data = (response.data as any).data || [];
        return {
          ...acc,
          [category]: data[0],
        };
      },
      {
        [MahjongCategory.fourPlayer]: new MahjongPlayerStatistics(),
        [MahjongCategory.threePlayer]: new MahjongPlayerStatistics(),
      }
    );

    return {
      playerName: statistics[MahjongCategory.fourPlayer].playerName,
      nickname: statistics[MahjongCategory.fourPlayer].nickname,
      records,
      statistics,
    };
  } catch (err) {
    console.log((err as Error).message);
    return new MahjongPlayerPageDto();
  }
}
