import type { IOrderQuery } from "~/types/order.query";

export const useOrderPagination = () => {
  const pagination = useState<IOrderQuery>("orderPagination", () => ({
    page: 1,
    pageSize: 10,
    sortBy: "id",
    sortOrder: "asc",
  }));

  return { pagination };
};
