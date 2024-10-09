"use server";

import { api } from "@/lib/axiosInterceptor";
import { revalidatePath } from "next/cache";

export async function deleteRecord(id: number) {
  try {
    const response = await api.delete(`/mahjong/game/${id}`);
    // console.log(response.data);
    if (response.status !== 200) return false;
    else {
      revalidatePath(`/mahjong`);
      return true;
    }
  } catch (err) {
    // console.log((err as Error).message);
    return false;
  }
}
