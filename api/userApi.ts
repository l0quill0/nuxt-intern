import type { IItem } from "~/Types/item.type";
import type { IUser } from "~/Types/user.type";

export async function getMe() {
  return useApi<IUser>("user/me", {
    method: "GET",
  });
}

export async function updateMe(email?: string, name?: string) {
  return useNuxtApp().$api<IUser>("user/update-me", {
    method: "PATCH",
    body: { email, name },
  });
}

export async function getFavourites() {
  return useApi<{ userId: number; items: IItem[] }>("favourite", {
    method: "GET",
  });
}

export async function addFavourites(itemId: number) {
  return useNuxtApp().$api(`favourite/${itemId}`, {
    method: "POST",
  });
}

export async function removeFavourites(itemId: number) {
  return useNuxtApp().$api(`favourite/${itemId}`, {
    method: "DELETE",
  });
}
