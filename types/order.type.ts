import type { IOrderItem } from "./order.item.type";

export interface IOrder {
  id: number;
  status: string;
  total: number;
  createdAt: Date;
  postOffice: string | null;
  items: IOrderItem[];
}
