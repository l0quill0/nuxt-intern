import type { IPaginationMeta } from "./paginationMeta.type";

export interface IItem {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  isRemoved: boolean;
  score?: { count: number; avg: number };
  category: { name: string; slug: string };
}

export interface ICreateItem {
  title: string;
  description: string;
  price: number;
  category: string;
  image: File;
}

export interface IUpdateItem extends Partial<ICreateItem> {}

export interface IItemQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  sortOrder?: string;
  category?: string[];
  showRemoved?: string;
}

export interface IPaginatedItems {
  data: IItem[];
  meta: IPaginationMeta;
}

export interface IComment {
  id: number;
  user: string;
  userId: number;
  text: string;
  score: number;
}

export interface ICommentPaginated {
  items: IComment[];
  meta: IPaginationMeta;
}
