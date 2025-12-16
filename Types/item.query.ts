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
