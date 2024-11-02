"use server";

import { api } from "@/lib/axiosInterceptor";
import { text } from "@/lib/data";

export async function createPlayer(prevState: any, formData: FormData) {
  try {
    const playerName = formData.get("playername");
    // TODO: POST /mahjong/player에 nickname이 있어야 함
    const response = await api.post(`/mahjong/player`, {
      playerName,
    });
    if (response.status !== 201)
      return {
        state: "error",
        message:
          (response as any).response.data.message ??
          text.mahjong.addPlayer.error,
      };
    else {
      return {
        state: "success",
        message: text.mahjong.addPlayer.success,
      };
    }
  } catch (err) {
    // console.log((err as Error).message);
    return { state: "error", message: text.mahjong.addPlayer.error };
  }
}
