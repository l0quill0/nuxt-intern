<script setup lang="ts">
import type { IItem } from "~/types/item.types";

const props = defineProps<{
  itemInfo: IItem;
}>();

const emit = defineEmits<{
  (e: "click", itemId: number): void;
}>();

const config = useRuntimeConfig();

const { title, image, category, price, id } = props.itemInfo;

const imageUrl = `${config.public.bucketUrl}${image}`;
</script>

<template>
  <div
    class="w-87.5 h-110 flex flex-col items-center p-8.75 hover:border bg-accent-50 hover:border-main-400 hover:cursor-pointer"
    @click="() => emit('click', id)"
  >
    <NuxtImg
      :key="id"
      :src="imageUrl"
      class="h-55 w-70 object-cover"
      :placeholder="'/no-image.png'"
    />
    <span class="mt-auto">{{
      category.name.charAt(0).toUpperCase() + category.name.slice(1)
    }}</span>
    <h1 class="font-semibold text-2xl mt-2.5 mb-3.75">
      {{ title }}
    </h1>
    <UButton
      color="main"
      class="w-fit text-white pt-2.5 pb-2.5 pr-5 pl-5 text-[18px] border-white"
      >{{ `${price.toFixed(2)} ₴` }}</UButton
    >
  </div>
</template>
