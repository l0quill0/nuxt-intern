<script setup lang="ts">
import type { IItem } from "~/types/item.type";
const config = useRuntimeConfig();
const props = defineProps<{
  itemInfo: IItem;
}>();
const emit = defineEmits<{
  (e: "click", itemId: number): void;
}>();

const { title, image, category, price, id } = props.itemInfo;

const imageUrl = `${config.public.bucketUrl}${image}`;
</script>

<template>
  <div
    class="w-[350px] h-[440px] flex flex-col items-center p-[35px] hover:border hover: border-[#333333]"
    @click="() => emit('click', id)"
  >
    <NuxtImg
      :key="id"
      :src="imageUrl"
      class="h-[220px] w-[280px] object-cover"
      :placeholder="'/no-image.png'"
    />
    <span class="mt-auto">{{ category.name }}</span>
    <h1 class="font-semibold text-2xl mt-2.5 mb-[15px]">
      {{ title }}
    </h1>
    <UButton
      class="w-fit rounded-none bg-[#333333] text-white pt-2.5 pb-2.5 pr-5 pl-5 text-[18px] hover:bg-gray-500 border border-white active:bg-[#333333] duration-300"
      >{{ `${price} ₴` }}</UButton
    >
  </div>
</template>
