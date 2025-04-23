"use server";

import { api } from "@/lib/axiosInterceptor";
import {
  MahjongCategory,
  MahjongPlayersDto,
  MahjongRival,
  MahjongRivalPageDto,
} from "@/types/mahjong";

function buildPlayer(response: Axios.AxiosXHR<unknown>) {
  return response.data as MahjongPlayersDto;
}

export async function fetchRivalsPage(
  playerName: string,
  category: MahjongCategory
) {
  try {
    const playerResponsePromise = api.get(`/mahjong/player/${playerName}/info`);
    const rivalsResponsePromise = await api.get(
      `/mahjong/statistics/player/rivals`,
      {
        params: {
          playerName: playerName,
          category,
        },
      }
    );
    const [playerResponse, rivalsResponse] = await Promise.all([
      playerResponsePromise,
      rivalsResponsePromise,
    ]);
    const player = buildPlayer(playerResponse);
    const rivals = rivalsResponse.data as MahjongRival[];
    return {
      playerName: player.playerName,
      nickname: player.nickname,
      rivals,
    };
  } catch (err) {
    console.log((err as Error).message);
    return new MahjongRivalPageDto();
  }
}
