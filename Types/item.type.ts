import type { ICategory } from "./category.type";

export interface IItem {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  categoryName: ICategory;
}
