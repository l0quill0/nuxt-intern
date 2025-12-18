import type { IcategoryQuery } from "~/types/category.query";
export const useCategoryPagination = () => {
  const pagination = useState<IcategoryQuery>("orderPagination", () => ({
    page: undefined,
    pageSize: undefined,
    search: undefined,
  }));

  return { pagination };
};
