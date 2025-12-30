import type { IItem } from "./item.type";

export interface IOrderItem extends IItem {
  quantity: number;
}
