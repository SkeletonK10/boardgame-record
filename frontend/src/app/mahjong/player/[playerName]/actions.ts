"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongCategory } from "../../dto";
import { MahjongPlayerPageDto } from "./dto";

export async function fetchPlayer(playerName: string) {
  try {
    const categories = Object.values(MahjongCategory);
    const responses = await Promise.all(
      categories.map(async (category) => {
        return await api.get(`/mahjong/player/record`, {
          params: {
            playername: playerName,
            category,
          },
        });
      })
    );
    // console.log(response.data);
    const records = responses.reduce(
      (acc, response, idx) => {
        const category = categories[idx];
        const data = ((response.data as any).data || []).slice(0, 10);
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
    return {
      records,
    };
  } catch (err) {
    console.log((err as Error).message);
    return new MahjongPlayerPageDto();
  }
}
