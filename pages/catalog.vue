<script setup lang="tsx">
import { getPaginatedProducts } from "~/api/productApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";
import type { IProduct } from "~/types/product.types";

const { pagination, isInfiniteScroll } = useItemPagination();

isInfiniteScroll.value = true;

const { data: response } = await getPaginatedProducts(pagination);

const page = computed(() => pagination.value.page ?? 1);

const totalPages = computed(() => response.value?.totalPages ?? 0);

const items = ref<IProduct[]>([]);

watch(
  () => response.value,
  (res) => {
    if (!res) return;

    if (res.currentPage === 1) {
      items.value = res.items;
    } else {
      items.value = [...items.value, ...res.items];
    }
  },
  { immediate: true },
);

function onItemClick(id: number) {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
}

function onLoadMoreClick() {
  pagination.value.page = page.value + 1;
}
</script>

<template>
  <div class="w-full flex flex-col items-center pt-5 lg:pt-12.5 xl:pt-25">
    <CatalogFilters />
    <h2
      v-if="items.length === 0"
      class="text-3xl font-bold w-full text-center pt-15"
    >
      Товарів не знайдено
    </h2>
    <div
      class="xl:gap-x-7.5 py-15 max-w-277.5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:gap-x-3.75"
    >
      <template v-for="(item, index) in items" :key="item.id">
        <ItemCard :product-info="item" @click="onItemClick" />
        <div
          v-if="index + 1 !== items.length"
          class="w-full h-px bg-accent-100 lg:hidden"
        ></div>
        <div
          v-if="(index + 1) % 2 === 0 && index + 1 !== items.length"
          class="w-full h-px bg-accent-100 my-3.75 hidden lg:block xl:hidden col-span-full"
        ></div>
        <div
          v-if="(index + 1) % 3 === 0 && index + 1 !== items.length"
          class="w-full h-px bg-accent-100 my-3.75 hidden xl:block col-span-full"
        ></div>
      </template>
    </div>
    <UButton
      v-if="page < totalPages"
      color="main"
      class="font-medium text-[18px] py-3.75 px-8.75 border border-white text-white"
      @click="onLoadMoreClick"
      >Завантажи ще</UButton
    >
  </div>
</template>
