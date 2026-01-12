import type { ICategoryQuery } from "~/types/category.types";

export const useCategoryPagination = () => {
  const pagination = useState<ICategoryQuery>("orderPagination", () => ({
    page: undefined,
    pageSize: undefined,
    search: undefined,
  }));

  return { pagination };
};
