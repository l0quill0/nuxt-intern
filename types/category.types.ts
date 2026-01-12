import type { IPaginationMeta } from "./paginationMeta.type";

export interface ICategory {
  id: number;
  name: string;
  image: string;
  slug: string;
  immutable: boolean;
}

export interface ICategoryQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ICategoryPaginated {
  data: ICategory[];
  meta: IPaginationMeta;
}
