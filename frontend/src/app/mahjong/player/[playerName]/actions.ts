"use server";

import { api } from "@/lib/axiosInterceptor";
import {
  MahjongCategoryValues,
  MahjongGameRecord,
  MahjongPlayerStatistics,
  MahjongPlayerPageDto,
} from "@/dto/mahjong";

const categories = MahjongCategoryValues;

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
      "4마": [],
      "3마": [],
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
      "4마": [],
      "3마": [],
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
      "4마": new MahjongPlayerStatistics(),
      "3마": new MahjongPlayerStatistics(),
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
      playerName: statistics["4마"].playerName,
      nickname: statistics["4마"].nickname,
      rankings,
      records,
      statistics,
    };
  } catch (err) {
    console.log((err as Error).message);
    return new MahjongPlayerPageDto();
  }
}
