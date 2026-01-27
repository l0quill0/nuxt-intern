import {
  type IOrdersPaginated,
  type IOrderQuery,
  type IUpdateOrder,
  type IOrder,
  type IOrderCreateUnauth,
} from "~/types/order.types";

export function getOrderById(orderId: number) {
  return useApi<IOrder>(`/order/${orderId}`, {
    method: "GET",
  });
}

export function getActive() {
  return useNuxtApp().$api<IOrder>(`/order/active`, {
    method: "GET",
  });
}

export function getOrders(orderQuery: Ref<IOrderQuery>) {
  return useApi<IOrdersPaginated>("/order", {
    method: "GET",
    query: orderQuery,
    key: "orderPagination",
  });
}

export function createUnauth(data: IOrderCreateUnauth) {
  return useNuxtApp().$api(`/order/unauth`, {
    method: "POST",
    body: data,
  });
}

export function updateOrder(orderId: number, data: IUpdateOrder) {
  return useNuxtApp().$api(`/order/${orderId}`, {
    method: "PATCH",
    body: data,
  });
}
