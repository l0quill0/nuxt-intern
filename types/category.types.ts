export interface ICategory {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface ICreateCategory {
  name: string;
  image: File;
}

export interface ICategoryQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ICategoryPaginated {
  items: ICategory[];
  currentPage: number;
  totalPages: number;
}
