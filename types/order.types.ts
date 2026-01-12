import type { IItem } from "./item.types";
import type { IPaginationMeta } from "./paginationMeta.type";

export interface IOrder {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  postOffice: {
    name: string;
    settlement: string;
    region: string;
  };
  items: IOrderItem[];
}

export interface IOrderItem extends IItem {
  quantity: number;
}

export interface IOrderQuery {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface IOrdersPaginated {
  data: IOrder[];
  meta: IPaginationMeta;
}
