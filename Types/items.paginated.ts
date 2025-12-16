import type { IItem } from "./item.type";
import type { IPaginationMeta } from "./pagination.meta";

export interface IPaginatedItems {
  data: IItem[];
  meta: IPaginationMeta;
}
