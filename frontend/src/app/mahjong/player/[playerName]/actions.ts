"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongCategoryValues } from "@/lib/constants/mahjong";
import {
  MahjongGameRecord,
  MahjongPlayerStatistics,
  MahjongPlayerPageDto,
  MahjongPlayersDto,
} from "@/types/mahjong";

const categories = MahjongCategoryValues;

function buildPlayer(response: Axios.AxiosXHR<unknown>) {
  return response.data as MahjongPlayersDto;
}

function buildRankings(
  response: Axios.AxiosXHR<unknown>[],
  playerName: string
) {
  return response.reduce(
    (acc, response, idx) => {
      const category = categories[idx];
      const data: MahjongGameRecord[] = (
        (response.data as MahjongGameRecord[]) || []
      )
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
      const data = response.data || [];
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
      const data: MahjongPlayerStatistics[] =
        (response.data as MahjongPlayerStatistics[]) || [];
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
    const playerResponsePromise = api.get(`/mahjong/player/${playerName}/info`);
    const gameResponsePromise = categories.map(async (category) => {
      return await api.get(`/mahjong/game`, {
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

    const [playerResponse, gameResponse, statisticsResponse] =
      await Promise.all([
        playerResponsePromise,
        Promise.all(gameResponsePromise),
        Promise.all(statisticsResponsePromise),
      ]);

    // console.log(response.data);
    const player = buildPlayer(playerResponse);
    const rankings = buildRankings(gameResponse, playerName);
    const records = buildRecords(gameResponse);
    const statistics = buildStatistics(statisticsResponse);

    return {
      playerName: player.playerName,
      nickname: player.nickname,
      rankings,
      records,
      statistics,
    };
  } catch (err) {
    console.log((err as Error).message);
    return new MahjongPlayerPageDto();
  }
}
