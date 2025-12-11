export interface IOrderQuery {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}
