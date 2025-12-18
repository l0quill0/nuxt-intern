<script setup lang="tsx">
import { getPaginatedItems } from "~/api/itemApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";
import type { IItem } from "~/types/item.type";

const { pagination, isInfiniteScroll } = useItemPagination();

isInfiniteScroll.value = true;

const { data: response } = await getPaginatedItems(pagination);

const items = ref<IItem[]>([]);

watch(
  () => response.value,
  (res) => {
    if (!res) return;

    if (res.meta.currentPage === 1) {
      items.value = res.data;
    } else {
      items.value = [...items.value, ...res.data];
    }
  },
  { immediate: true }
);

const page = computed(() => pagination.value.page ?? 1);
const totalPages = computed(() => response.value?.meta.totalPages ?? 0);

function onItemClick(id: number) {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
}

function onLoadMoreClick() {
  pagination.value.page = page.value + 1;
}
</script>

<template>
  <div class="w-full flex flex-col items-center pt-[100px]">
    <CatalogFilters />
    <div class="flex gap-x-[30px] pt-[60px] pb-[60px] flex-wrap max-w-[1110px]">
      <template v-for="(item, index) in items" :key="item.id">
        <ItemCard :item-info="item" @click="onItemClick" />
        <div
          v-if="(index + 1) % 3 === 0 && index + 1 !== items.length"
          class="w-full h-px bg-[#D6D6D6] my-[30px]"
        ></div>
      </template>
    </div>
    <UButton
      v-if="page < totalPages"
      class="rounded-none text-white bg-[#333333] font-medium text-[18px] pt-[15px] pb-[15px] pl-[35px] pr-[35px] hover:bg-gray-500 border border-white active:bg-[#333333] duration-300"
      @click="onLoadMoreClick"
      >Завантажи ще</UButton
    >
  </div>
</template>
