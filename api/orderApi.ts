import type { IOrdersPaginated, IOrderQuery } from "~/types/order.types";

export function getOrders(orderQuery: Ref<IOrderQuery>) {
  return useApi<IOrdersPaginated>("/order", {
    method: "GET",
    query: orderQuery,
    key: "orderPagination",
  });
}

export async function createOrder(officeId: number) {
  return useNuxtApp().$api(`/order/send`, {
    method: "PATCH",
    body: { postOffice: officeId },
  });
}

export async function cancelOrder(id: number) {
  return useNuxtApp().$api(`/order/cancel/${id}`, {
    method: "PATCH",
  });
}

export async function confirmOrder(id: number) {
  return useNuxtApp().$api(`/order/confirm/${id}`, {
    method: "PATCH",
  });
}
