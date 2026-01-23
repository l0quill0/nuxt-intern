<script setup lang="ts">
import type { IProductWithScore } from "~/types/product.types";

const route = useRoute();
const category = route.params.category;

const compStore = useCompStore();
const list = compStore.list(category as string);

const { data: items } = await useAsyncData(
  `comparison-${category}`,
  async () => {
    if (!list?.items.length) return [];

    const promises = list.items.map((id) =>
      useNuxtApp().$api<IProductWithScore>(`/product/${id}`, { method: "GET" }),
    );

    return await Promise.all(promises);
  },
);

const onItemRemove = (id: number) => {
  if (items.value) items.value = items.value.filter((item) => item.id !== id);
};
</script>

<template>
  <ComparisonTable
    v-if="items?.length"
    :items="items"
    class="pt-15"
    @item-remove="onItemRemove"
  />
  <h1 v-else class="font-bold text-2xl pt-20">{{ "Щось пішло не так :(" }}</h1>
</template>
