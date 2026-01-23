import type { ICategory } from "./category.types";

export interface IProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  category: ICategory;
  createdAt: Date;
  isRemoved: boolean;
  description: string;
}

export interface IProductWithScore extends IProduct {
  score: {
    avg: number;
    count: number;
  };
}

export interface ICreateProduct {
  title: string;
  price: number;
  image: File;
  category: string;
  description: string;
}

export interface IUpdateProduct extends Partial<ICreateProduct> {}

export interface IProductQuery {
  page?: number;
  search?: string;
  sortBy?: string;
  priceMin?: number;
  priceMax?: number;
  category?: string[];
  pageSize?: number;
  sortOrder?: string;
  showRemoved?: string;
}

export interface IProductsPaginated {
  items: IProduct[];
  currentPage: number;
  totalPages: number;
}

export interface IComment {
  id: number;
  text: string;
  score: number;
  author: { id: number; name: string };
}

export interface ICreateComment {
  text: string;
  score: number;
}

export interface ICommentPaginated {
  items: IComment[];
  totalPages: number;
  currentPage: number;
}
