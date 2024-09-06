"use server";

import { api } from "@/lib/axiosInterceptor";
import { text } from "@/lib/data";

export async function createRecord(prevState: any, formData: FormData) {
  try {
    const body = {
      category: formData.get("category"),
      players: ["east", "south", "west", "north"].map((val) => {
        return {
          playerName: formData.get(`${val}-player-name`),
          isGuest: formData.get(`${val}-is-guest`),
          score: formData.get(`${val}-score`),
        };
      }),
    };
    console.log(body);
    const response = await api.post(`/mahjong`, body);
    console.log(response);
    if (!(response.data as any).data)
      return { message: text.mahjong.addRecord.error };
    else return { message: text.mahjong.addRecord.success };
  } catch (err) {
    console.log((err as Error).message);
    return { message: text.mahjong.addRecord.error };
  }
}
