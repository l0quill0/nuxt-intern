import type { IOrder } from "~/types/order.type";

export async function getCart() {
  return useApi<IOrder>("order/current", {
    method: "GET",
  });
}

export async function addToCart(itemId: number, quantity?: number) {
  return useNuxtApp().$api(`order/add-item`, {
    method: "POST",
    body: { itemId, quantity },
  });
}

export async function removeFromCart(itemId: number, quantity?: number) {
  return useNuxtApp().$api(`order/remove-item`, {
    method: "DELETE",
    body: { itemId, quantity },
  });
}

export async function clearCart() {
  return useNuxtApp().$api(`order/clear`, {
    method: "DELETE",
  });
}
