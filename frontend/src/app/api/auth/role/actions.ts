"use server";
import { api } from "@/lib/axiosInterceptor";
import { text } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function fetchUsers() {
  try {
    const response = await api.get(`/auth/role`);
    // console.log(response.data);
    if (!(response.data as any).data) return [];
    else return (response.data as any).data;
  } catch (err) {
    console.log((err as Error).message);
    return [];
  }
}

export async function grantRole(prevState: any, formData: FormData) {
  try {
    const body = {
      username: formData.get("username"),
      role: formData.get("role"),
    };
    const response = await api.post(`/auth/role`, body);
    // console.log(response.data);
    if ((response.data as any).code !== "OK")
      return { message: text.auth.manageRole.error };
    else {
      revalidatePath("/api/auth/role");
      return { message: text.auth.manageRole.success };
    }
  } catch (err) {
    // console.log((err as Error).message);
    return { message: text.auth.manageRole.error };
  }
}
