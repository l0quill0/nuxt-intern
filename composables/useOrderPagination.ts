import type { IOrderQuery } from "~/types/order.types";

export const useOrderPagination = () => {
  const pagination = useState<IOrderQuery>("orderPagination", () => ({
    page: 1,
    pageSize: 10,
    sortBy: "id",
    sortOrder: "asc",
  }));

  return { pagination };
};
