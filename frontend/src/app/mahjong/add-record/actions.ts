"use server";

import { api } from "@/lib/axiosInterceptor";
import { text } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function fetchPlayers() {
  try {
    const response = await api.get(`/mahjong/player`);
    // console.log(response.data);
    if (!(response.data as any).data) return [];
    else return (response.data as any).data;
  } catch (err) {
    console.log((err as Error).message);
    return [];
  }
}

export async function createRecord(prevState: any, formData: FormData) {
  try {
    const body = {
      category: formData.get("category"),
      players: ["east", "south", "west", "north"].map((val) => {
        const playerName = formData.get(`${val}-player-name`);
        const isGuest = formData.get(`${val}-is-guest`) === "on" ? true : false;
        const score = formData.get(`${val}-score`);
        return {
          playerName: playerName ? playerName : undefined,
          isGuest: isGuest,
          score: score ? score : undefined,
        };
      }),
    };
    const response = await api.post(`/mahjong`, body);
    // console.log(response.data);
    if (!(response.data as any).data)
      return { message: text.mahjong.addRecord.error };
    else {
      revalidatePath(`/mahjong`);
      return { message: text.mahjong.addRecord.success };
    }
  } catch (err) {
    // console.log((err as Error).message);
    return { message: text.mahjong.addRecord.error };
  }
}
