import type { IItem } from "./item.type";

export interface IPaginatedItems {
  data: IItem[];
  meta: {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPage: number;
  };
}
