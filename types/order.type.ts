import type { IOrderItem } from "./order.item.type";

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
