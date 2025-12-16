import type { IItemQuery } from "~/Types/item.query";

export const useItemPagination = () => {
  const route = useRoute();
  const router = useRouter();

  const enabled = computed(
    () =>
      route.path.startsWith("/catalog") || route.path.startsWith("/admin/items")
  );

  const { query } = route;

  const pagination = useState<IItemQuery>("itemPagination", () => ({
    page: parseQueryParam({
      value: query.page,
      transformer: Number,
    }),
    pageSize: parseQueryParam({
      value: query.pageSize,
      transformer: Number,
    }),
    search: parseQueryParam({ value: query.search }),
    priceMin: parseQueryParam({ value: query.priceMin, transformer: Number }),
    priceMax: parseQueryParam({ value: query.priceMax, transformer: Number }),
    sortBy: parseQueryParam({
      value: query.sortBy,
    }),
    sortOrder: parseQueryParam({
      value: query.sortOrder,
    }),
    category: parseQueryParam({
      value: query.category,
      transformer: (value) => (Array.isArray(value) ? value : [value]),
    }),
    showRemoved: parseQueryParam({
      value: query.showRemoved,
    }),
  }));

  const updateQuery = () => {
    if (!enabled.value) return;
    const clean = Object.fromEntries(
      Object.entries(pagination.value).filter(
        ([_, v]) => v !== undefined && v !== ""
      )
    );

    router.replace({ query: clean });
  };

  watch(pagination, updateQuery, { deep: true });
  onMounted(() => enabled && updateQuery());

  return { pagination };
};
