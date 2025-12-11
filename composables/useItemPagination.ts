export const useItemPagination = () => {
  const route = useRoute();
  const router = useRouter();

  const enabled = computed(
    () =>
      route.path.startsWith("/catalog") || route.path.startsWith("/items-admin")
  );

  const { query } = route;

  const pagination = useState("itemPagination", () => ({
    page: parseQueryParam({
      def: 1,
      required: true,
      value: query.page,
      transformer: Number,
    }),
    pageSize: parseQueryParam({
      def: 6,
      required: true,
      value: query.pageSize,
      transformer: Number,
    }),
    search: parseQueryParam({ value: query.search }),
    priceMin: parseQueryParam({ value: query.priceMin, transformer: Number }),
    priceMax: parseQueryParam({ value: query.priceMax, transformer: Number }),
    sortBy: parseQueryParam({
      value: query.sortBy,
      def: "title",
      required: true,
    }),
    sortOrder: parseQueryParam({
      value: query.sortOrder,
      def: "asc",
      required: true,
    }),
    category: parseQueryParam({
      value: query.category,
      def: [],
      transformer: (value) => (Array.isArray(value) ? value : [value]),
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
