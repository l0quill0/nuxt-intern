import type { IOrder } from "./order.type";

export interface IOrdersPaginated {
  data: IOrder[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
