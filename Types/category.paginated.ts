import type { ICategory } from "./category.type";
import type { IPaginationMeta } from "./pagination.meta";

export interface ICategoryPaginated {
  data: ICategory[];
  meta: IPaginationMeta;
}
