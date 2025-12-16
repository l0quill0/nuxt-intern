import type { MultiWatchSources } from "vue";
import type { RouteQueryAndHash } from "vue-router";
import type { ICreateItem } from "~/Types/item.create.type";
import type { IItemQuery } from "~/Types/item.query";
import type { IItem } from "~/Types/item.type";
import type { IPaginatedItems } from "~/Types/items.paginated";
import type { IUpdateItem } from "~/Types/update.item";

export async function createItem(payload: ICreateItem) {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("price", payload.price.toString());
  formData.append("file", payload.image);
  formData.append("category", payload.category);

  return useNuxtApp().$api(`item`, {
    method: "POST",
    body: formData,
  });
}

export async function updateItem(itemId: number, payload: IUpdateItem) {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.price) formData.append("price", payload.price.toString());
  if (payload.image) formData.append("file", payload.image);
  if (payload.category) formData.append("category", payload.category);

  return useNuxtApp().$api(`item/${itemId}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function restoreItem(id: number) {
  return useNuxtApp().$api(`item/return/${id}`, {
    method: "PATCH",
  });
}

export async function removeItem(id: number) {
  return useNuxtApp().$api(`item/${id}`, {
    method: "DELETE",
  });
}

export async function getItemById(id: number) {
  return useApi<IItem & { isInFavourite: boolean }>(`item/${id}`, {
    method: "GET",
  });
}

export function getPaginatedItems(queryOptions: Ref<IItemQuery>) {
  return useApi<IPaginatedItems>(`item`, {
    method: "GET",
    query: queryOptions,
    key: "items-paginated",
  });
}
