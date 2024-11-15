"use server";

import { api } from "@/lib/axiosInterceptor";
import { MahjongDetailedGameDto } from "@/types/mahjong";

export async function fetchDetailedGame(
  id: number
): Promise<MahjongDetailedGameDto> {
  try {
    const response = await api.get(`/mahjong/game/${id}`);
    // console.log(response.data);
    if (!response.data)
      throw new Error(
        "데이터를 불러오는 데 실패했습니다. 관리자에게 문의해 주세요"
      );
    else return response.data as MahjongDetailedGameDto;
  } catch (err) {
    console.log((err as Error).message);
    return {} as MahjongDetailedGameDto;
  }
}
