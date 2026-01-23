import type { IUser } from "./auth.types";
import type { IPostOffice } from "./postOffice.types";
import type { IProduct } from "./product.types";

export interface IOrder {
  id: number;
  user: IUser;
  total: number;
  items: IOrderProduct[];
  status: string;
  createdAt: string;
  postOffice?: IPostOffice;
}

export interface IOrderProduct {
  product: IProduct;
  quantity: number;
}

export interface IOrderQuery {
  page?: number;
  sortBy?: string;
  pageSize?: number;
  sortOrder?: string;
}

export interface IOrdersPaginated {
  items: IOrder[];
  totalPages: number;
  currentpage: number;
}

export interface IUpdateOrder {
  postId?: number;
  status?: string;
  items?: { productId: number; quantity: number }[];
}
