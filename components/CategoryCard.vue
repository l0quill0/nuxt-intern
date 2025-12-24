<script setup lang="ts">
import type { ICategory } from "~/types/category.type";
const config = useRuntimeConfig();

const props = defineProps<{
  category: ICategory;
}>();

const emit = defineEmits<{
  (e: "click", category: string): void;
}>();

const { image, name, id, slug } = props.category;

const imageUrl = `${config.public.bucketUrl}${image}`;
</script>

<template>
  <div
    class="relative flex flex-col w-[350px] border border-transparent hover:border-main-400 p-1 hover:cursor-pointer"
    @click="() => emit('click', slug)"
  >
    <NuxtImg
      :key="id"
      :src="imageUrl"
      class="w-[350px] h-[280px] object-cover"
      :placeholder="'/no-image.png'"
    />
    <h3
      class="absolute font-medium text-[24px] bottom-0 self-center text-black"
    >
      {{ name.charAt(0).toUpperCase() + name.slice(1) }}
    </h3>
  </div>
</template>
