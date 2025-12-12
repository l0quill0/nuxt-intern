<script setup lang="tsx">
import { getPaginatedItems } from "~/api/itemApi";
import type { IItem } from "~/Types/item.type";

const route = useRoute();

const items = ref<IItem[]>([]);

watch(
  () => route.query,
  () => loadItems(),
  { deep: true, immediate: true }
);

function onItemClick(id: number) {
  navigateTo(`/item/${id}`);
}

async function loadItems() {
  try {
    const response = await getPaginatedItems(route.query);
    items.value = response.data;
  } catch (error) {}
}

await loadItems();
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
