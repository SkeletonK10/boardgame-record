"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongYakumanValues } from "@/lib/constants/mahjong";
import { text } from "@/lib/data";
import {
  MahjongPlayersDto,
  MahjongSeasonDto,
  MahjongYakuman,
} from "@/types/mahjong";
import { revalidatePath } from "next/cache";

export async function fetchSeasons(): Promise<MahjongSeasonDto[]> {
  try {
    const response = await api.get(`/mahjong/season`);
    // console.log(response.data);
    if (!response.data) return [];
    else return response.data as MahjongSeasonDto[];
  } catch (err) {
    console.log((err as Error).message);
    return [];
  }
}

export async function postSeasonManagement(prevState: any, formData: FormData) {
  try {
    const isStart = formData.get("isStart") === "true";
    const body = {
      season: Number(formData.get("season")),
      startDate: formData.get("startDate")?.slice(0, 10),
      endDate: formData.get("endDate")?.slice(0, 10),
    };
    const response = isStart
      ? await api.post(`/mahjong/season`, body)
      : await api.patch(`/mahjong/season`, body);
    if (response.status !== 200) {
      return {
        state: "error",
        message:
          (response as any).response.data.message ??
          text.mahjong.manageSeason.error,
      };
    } else {
      revalidatePath(`/mahjong`);
      return {
        state: "success",
        message: text.mahjong.manageSeason.success,
      };
    }
  } catch (err) {
    console.log((err as Error).message);
    return { state: "error", message: text.mahjong.manageSeason.error };
  }
}
