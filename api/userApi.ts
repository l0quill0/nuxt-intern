import {
  type IUpdatePassword,
  type IUpdateUser,
  type IUser,
  type IUserSelectionCount,
} from "~/types/auth.types";
import { type IProduct } from "~/types/product.types";

export function getMe() {
  return useApi<IUser>("/user/me", {
    method: "GET",
  });
}

export async function getCount() {
  return useApi<IUserSelectionCount>("/user/count", {
    method: "GET",
    key: "count",
  });
}

export function updateMe(data: IUpdateUser) {
  return useNuxtApp().$api("/user/update-me", {
    method: "PATCH",
    body: data,
  });
}

export async function updatePassword(data: IUpdatePassword) {
  return useNuxtApp().$api("/user/update-password", {
    method: "PATCH",
    body: data,
  });
}

export async function addPassword(password: string) {
  return useNuxtApp().$api("/user/add-password", {
    method: "PATCH",
    body: { password },
  });
}

export async function getFavourites() {
  return useApi<IProduct[]>("/favourite", {
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
