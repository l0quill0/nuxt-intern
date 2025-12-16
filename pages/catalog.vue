<script setup lang="tsx">
import { getPaginatedItems } from "~/api/itemApi";
import type { IItem } from "~/Types/item.type";

const { pagination } = useItemPagination();

const { data: response } = getPaginatedItems(pagination);

const items = computed<IItem[]>(() => {
  return response.value?.data ?? [];
});

function onItemClick(id: number) {
  navigateTo(`/item/${id}`);
}
</script>

<template>
  <div class="w-screen flex flex-col items-center pt-[100px]">
    <CatalogFilters />
    <h2 v-if="!items.length" class="text-3xl font-bold text-[#333333] pt-12">
      Товарів не знайдено
    </h2>
    <div
      class="flex gap-x-[30px] pt-[60px] pb-[60px] flex-wrap max-w-[1110px]"
      v-if="items.length"
    >
      <template v-for="(item, index) in items" :key="item.id">
        <ItemCard :item-info="item" @click="onItemClick" />
        <div
          v-if="(index + 1) % 3 === 0"
          class="w-full h-px bg-[#D6D6D6] my-[30px]"
        ></div>
      </template>
    </div>
  </div>
</template>
