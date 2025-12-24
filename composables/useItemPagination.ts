import type { IItemQuery } from "~/types/item.query";

export const useItemPagination = () => {
  const route = useRoute();
  const router = useRouter();

  const enabled = computed(
    () =>
      route.path.startsWith("/catalog") || route.path.startsWith("/admin/items")
  );

  const { query } = route;

  const isInfiniteScroll = useState("infinite-scroll", () => false);

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

  const clearQuery = (keepCategory: boolean) => {
    Object.keys(pagination.value).forEach((k) => {
      if (keepCategory && k === "category") return;
      pagination.value[k as keyof IItemQuery] = undefined;
    });
  };

  const updateQuery = () => {
    if (!enabled.value) return;

    let clean = {};

    if (isInfiniteScroll.value) {
      clean = Object.fromEntries(
        Object.entries(pagination.value).filter(
          ([_, v]) =>
            v !== undefined && v !== "" && _ !== "page" && _ !== "pageSize"
        )
      );
    } else {
      clean = Object.fromEntries(
        Object.entries(pagination.value).filter(
          ([_, v]) => v !== undefined && v !== ""
        )
      );
    }

    router.replace({ query: clean });
  };

  watch(pagination, updateQuery, { deep: true });
  watch(
    () => [
      pagination.value.category,
      pagination.value.priceMax,
      pagination.value.priceMin,
      pagination.value.search,
      pagination.value.sortBy,
      pagination.value.sortOrder,
    ],
    () => {
      if (isInfiniteScroll) {
        pagination.value.page = undefined;
        pagination.value.pageSize = undefined;
      }
    }
  );
  watch(
    () => route.path,
    (newPath, oldPath) => {
      if (enabled) {
        oldPath === "/" ? clearQuery(true) : clearQuery(false);
      }
    }
  );
  onMounted(() => enabled && updateQuery());

  return { pagination, isInfiniteScroll };
};
