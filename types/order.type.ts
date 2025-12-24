import type { IItem } from "./item.type";

export interface IOrder {
  id: number;
  status: string;
  total: number;
  createdAt: Date;
  items: (IItem & { quantity: number })[];
}
