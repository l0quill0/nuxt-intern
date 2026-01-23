<script setup lang="ts">
import { Scale, Check } from "lucide-vue-next";
import type { IProduct } from "~/types/product.types";

const props = defineProps<{
  productInfo: IProduct;
}>();

const emit = defineEmits<{
  (e: "click", itemId: number): void;
}>();

const config = useRuntimeConfig();
const compStore = useCompStore();

const { title, image, category, price, id } = props.productInfo;

const isComp = computed(() => compStore.isInStore(id));

const imageUrl = `${config.public.bucketUrl}${image}`;

function onCompClick() {
  if (isComp.value) {
    compStore.removeItem(id, category.slug);
  } else {
    compStore.addItem(category.slug, category.name, id);
  }
}
</script>

<template>
  <div
    class="w-87.5 h-110 flex flex-col items-center p-8.75 hover:border bg-accent-50 hover:border-main-400 hover:cursor-pointer relative group"
    @click="() => emit('click', id)"
  >
    <UButton
      variant="ghost"
      class="absolute right-2.5 top-5 text-main-400 hover:bg-transparent hover:text-main-300 duration-300 xl:opacity-0 group-hover:opacity-100 transition-opacity ease-in active:bg-transparent"
      @click="onCompClick"
      @click.stop
      ><Scale /><Check class="absolute bottom-0 right-0 h-4 w-4" v-if="isComp"
    /></UButton>
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
