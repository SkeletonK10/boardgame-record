"use server";
import { api } from "@/lib/axiosInterceptor";
import { text } from "@/lib/data";
import { UserWithRolesDto } from "@/types/auth";
import { revalidatePath } from "next/cache";

export async function fetchUsers(): Promise<UserWithRolesDto[]> {
  try {
    const response = await api.get(`/auth/role`);
    // console.log(response.data);
    if (!response.data) return [];
    else return response.data as UserWithRolesDto[];
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
    if (response.status !== 201) return { message: text.auth.manageRole.error };
    else {
      revalidatePath("/api/auth/role");
      return { message: text.auth.manageRole.successToGrant };
    }
  } catch (err) {
    // console.log((err as Error).message);
    return { message: text.auth.manageRole.error };
  }
}

export async function depriveRole(prevState: any, formData: FormData) {
  try {
    const body = {
      username: formData.get("username"),
      role: formData.get("role"),
    };
    const response = await api.delete(`/auth/role`, { params: body });
    if (response.status !== 200) return { message: text.auth.manageRole.error };
    else {
      revalidatePath("/api/auth/role");
      return { message: text.auth.manageRole.successToDeprive };
    }
  } catch (err) {
    console.log((err as Error).message);
    return { message: text.auth.manageRole.error };
  }
}
