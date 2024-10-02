"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongCategory, MahjongGameRecord } from "../../dto";
import { MahjongPlayerPageDto } from "./dto";
import { MahjongPlayerStatistics } from "../../statistics/player/dto";

const categories = Object.values(MahjongCategory);

function buildRankings(
  response: Axios.AxiosXHR<unknown>[],
  playerName: string
) {
  return response.reduce(
    (acc, response, idx) => {
      const category = categories[idx];
      const data: MahjongGameRecord[] = ((response.data as any).data || [])
        .reverse()
        .slice(-10);
      const ranking = data.map(({ id, players }) => {
        const matchedPlayer = players.filter(
          (player) => player.playerName === playerName
        );
        return matchedPlayer[0].rank;
      });
      return {
        ...acc,
        [category]: ranking,
      };
    },
    {
      [MahjongCategory.fourPlayer]: [],
      [MahjongCategory.threePlayer]: [],
    }
  );
}

function buildRecords(response: Axios.AxiosXHR<unknown>[]) {
  return response.reduce(
    (acc, response, idx) => {
      const category = categories[idx];
      const data = (response.data as any).data || [];
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
}

function buildStatistics(response: Axios.AxiosXHR<unknown>[]) {
  return response.reduce(
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
}

export async function fetchPlayer(playerName: string) {
  try {
    const gameResponsePromise = categories.map(async (category) => {
      return await api.get(`/mahjong`, {
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

    const [gameResponse, statisticsResponse] = await Promise.all([
      Promise.all(gameResponsePromise),
      Promise.all(statisticsResponsePromise),
    ]);

    // console.log(response.data);
    const rankings = buildRankings(gameResponse, playerName);
    const records = buildRecords(gameResponse);
    const statistics = buildStatistics(statisticsResponse);

    return {
      playerName: statistics[MahjongCategory.fourPlayer].playerName,
      nickname: statistics[MahjongCategory.fourPlayer].nickname,
      rankings,
      records,
      statistics,
    };
  } catch (err) {
    console.log((err as Error).message);
    return new MahjongPlayerPageDto();
  }
}
