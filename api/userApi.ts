import type { IItem } from "~/types/item.type";
import type { IUser } from "~/types/user.type";

export async function getMe() {
  return useApi<IUser>("/user/me", {
    method: "GET",
  });
}

export async function updateMe(email?: string, name?: string) {
  return useNuxtApp().$api<IUser>("/user/update-me", {
    method: "PATCH",
    body: { email, name },
  });
}

export async function updatePassword(oldPassword: string, newPassword: string) {
  return useNuxtApp().$api("/user/update-password", {
    method: "PATCH",
    body: { oldPassword, newPassword },
  });
}

export async function addPassword(password: string) {
  return useNuxtApp().$api("/user/add-password", {
    method: "PATCH",
    body: { password },
  });
}

export async function getFavourites() {
  return useApi<{ userId: number; items: IItem[] }>("/favourite", {
    method: "GET",
  });
}

export async function addFavourites(itemId: number) {
  return useNuxtApp().$api(`/favourite/${itemId}`, {
    method: "POST",
  });
}

export async function removeFavourites(itemId: number) {
  return useNuxtApp().$api(`/favourite/${itemId}`, {
    method: "DELETE",
  });
}

export async function getCount() {
  return useApi<{ favCount: number; cartCount: number }>("/user/count", {
    method: "GET",
    key: "count",
  });
}
