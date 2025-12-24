import type { IOrder } from "./order.type";
import type { IPaginationMeta } from "./pagination.meta";

export interface IOrdersPaginated {
  data: IOrder[];
  meta: IPaginationMeta;
}
