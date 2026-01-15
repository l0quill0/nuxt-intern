<script setup lang="ts">
import { getItemById } from "~/api/itemApi";
import { Trash } from "lucide-vue-next";
import { PublicDynamicRoutes } from "~/enums/routes.enum";
import type { IItem } from "~/types/item.types";

const config = useRuntimeConfig();
const compStore = useCompStore();

const props = defineProps<{
  data: { category: string; categoryName: string; items: number[] };
}>();

const promises = props.data.items.map((item) =>
  useNuxtApp().$api<IItem>(`item/${item}`, { method: "GET" })
);

const items = await Promise.all(promises);

const onClearClick = () => {
  compStore.clearCategory(props.data.category);
};

const onListClick = () => {
  navigateTo(`${PublicDynamicRoutes.COMPARISON}${props.data.category}`);
};
</script>

<template>
  <div v-if="items.length > 0" class="flex flex-col p-2.5 group w-full">
    <div class="flex justify-between">
      <p class="font-semibold text-[24px]">
        {{
          props.data.categoryName.at(0)?.toUpperCase() +
          props.data.categoryName.slice(1)
        }}
      </p>
      <UButton
        variant="ghost"
        color="main"
        class="p-0 w-5 h-5 self-center ml-auto xl:opacity-0 group-hover:opacity-100 transition-opacity ease-in hover:bg-transparent"
        @click="onClearClick"
        ><Trash class="text-main-400"
      /></UButton>
    </div>
    <p class="pb-2 text-[14px] text-accent-300">
      {{
        `Кількість товарів: ${compStore.countByCategory(props.data.category)}`
      }}
    </p>
    <div
      class="flex flex-row gap-2.5 flex-wrap hover:cursor-pointer justify-evenly xl:justify-start"
      @click="onListClick"
    >
      <NuxtImg
        class="h-40 w-40 object-cover"
        v-for="item in items"
        :src="`${config.public.bucketUrl}${item?.image}`"
        :key="item.id"
      />
    </div>
  </div>
</template>
