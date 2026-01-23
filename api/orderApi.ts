import {
  type IOrdersPaginated,
  type IOrderQuery,
  type IUpdateOrder,
  type IOrder,
} from "~/types/order.types";

export function getOrderById(orderId: number) {
  return useApi<IOrder>(`/order/${orderId}`, {
    method: "GET",
  });
}

export function getActive() {
  return useApi<IOrder>(`/order/active`, {
    method: "GET",
    key: "active",
  });
}

export function getOrders(orderQuery: Ref<IOrderQuery>) {
  return useApi<IOrdersPaginated>("/order", {
    method: "GET",
    query: orderQuery,
    key: "orderPagination",
  });
}

export function updateOrder(orderId: number, data: IUpdateOrder) {
  return useNuxtApp().$api(`/order/${orderId}`, {
    method: "PATCH",
    body: data,
  });
}
