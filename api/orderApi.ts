import type { IOrderQuery } from "~/Types/order.query";
import type { IOrder } from "~/Types/order.type";
import type { IOrdersPaginated } from "~/Types/orders.paginated";

export function getOrders(orderQuery: Ref<IOrderQuery>) {
  return useApi<IOrdersPaginated>("order", {
    method: "GET",
    query: orderQuery,
    key: "orderPagination",
  });
}

export async function getOrderById(id: number) {
  return useApi<IOrder>(`order/${id}`, {
    method: "GET",
  });
}

export async function createOrder() {
  return useNuxtApp().$api(`order/send`, {
    method: "PATCH",
  });
}

export async function cancelOrder(id: number) {
  return useNuxtApp().$api(`order/cancel/${id}`, {
    method: "PATCH",
  });
}

export async function confirmOrder(id: number) {
  return useNuxtApp().$api(`order/confirm/${id}`, {
    method: "PATCH",
  });
}
