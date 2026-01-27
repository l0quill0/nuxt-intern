<script setup lang="ts">
import { PublicDynamicRoutes, PublicRoutes } from "~/enums/routes.enum";
import { Trash } from "lucide-vue-next";
import type { IProductWithScore } from "~/types/product.types";

const props = defineProps<{ items: IProductWithScore[] }>();
const emit = defineEmits<{
  (e: "itemRemove", id: number): void;
}>();

const config = useRuntimeConfig();
const compStore = useCompStore();

const onRemoveClick = (id: number, category: string) => {
  compStore.removeItem(id, category);
  emit("itemRemove", id);
};
</script>

<template>
  <div
    class="xl:max-w-277.5 max-w-11/12 overflow-x-scroll"
    v-if="items.length > 1"
  >
    <table class="table-fixed xl:min-w-277.5 min-w-11/12 [&>tbody>tr>td]:py-3">
      <colgroup>
        <col v-for="item in items" class="xl:min-w-70 xl:w-70 min-w-40 w-40" />
      </colgroup>
      <tbody>
        <tr>
          <td v-for="item in items">
            <div class="flex flex-col items-center group">
              <NuxtImg
                :src="`${config.public.bucketUrl}${item.image}`"
                class="xl:w-70 xl:h-70 w-35 h-35 object-cover p-2"
              />

              <div class="flex items-center gap-1">
                <NuxtLink
                  :to="`${PublicDynamicRoutes.ITEM}${item.id}`"
                  class="hover:border-b-main-400 border-b xl:border-b-transparent duration-300 text-wrap border-b-main-400"
                  >{{ item.title }}</NuxtLink
                >
                <UButton
                  variant="ghost"
                  class="hover:bg-transparent active:bg-transparent xl:opacity-0 transition-opacity ease-in group-hover:opacity-100 hover:text-accent-300 p-0"
                  color="main"
                  @click="onRemoveClick(item.id, item.category.slug)"
                  ><Trash class="h-4 w-4"
                /></UButton>
              </div>
            </div>
          </td>
        </tr>
        <tr class="bg-accent-100">
          <td :colspan="items.length">
            <div
              class="sticky left-[50%] -translate-x-1/2 max-w-fit text-center"
            >
              <p class="text-main-300 font-bold">Рейтинг</p>
            </div>
          </td>
        </tr>
        <tr>
          <td v-for="item in items">
            <div class="flex gap-1 justify-center py-3.5">
              <p v-if="item.score?.avg">
                {{ Number(item.score?.avg).toFixed(1) }}
              </p>
              <NuxtRating :rating-value="Number(item.score?.avg)" />
              <p>{{ `(${item.score?.count})` }}</p>
            </div>
          </td>
        </tr>
        <tr class="bg-accent-100">
          <td :colspan="items.length">
            <div
              class="sticky left-[50%] -translate-x-1/2 max-w-fit text-center"
            >
              <p class="text-main-300 font-bold">Ціна</p>
            </div>
          </td>
        </tr>
        <tr>
          <td v-for="item in items">
            <p class="text-center py-3.5">
              {{ `${item.price.toFixed(2)} ₴` }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="flex flex-col items-center text-2xl font-semibold">
    <p>Недостатньо товарів для порівняння</p>
    <NuxtLink
      :to="PublicRoutes.CATALOG"
      class="border-b-2 border-b-transparent hover:border-b-main-400 duration-300"
      >До каталогу</NuxtLink
    >
  </div>
</template>
