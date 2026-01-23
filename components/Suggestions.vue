<script setup lang="ts">
import { getSuggestedProducts } from "~/api/productApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";

const props = defineProps({
  productId: { type: Number, required: true },
});

const { data: response } = getSuggestedProducts(props.productId, 6);

const products = computed(() => response.value ?? []);

function onItemClick(id: number) {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
}
</script>

<template>
  <div
    v-if="products.length > 0"
    class="pt-5 xl:pt-10 flex flex-col items-center"
  >
    <h2 class="text-[21px] leading-[1.4] text-center">
      Ми підготували для вас щось особливе
    </h2>
    <h2 class="pt-3.75 text-3xl font-bold text-center">
      Товари які можуть вам сподобатись
    </h2>
  </div>
  <UCarousel
    v-if="products.length > 0"
    v-slot="{ item: product }"
    :items="products"
    loop
    arrows
    dots
    wheel-gestures
    class=""
    :ui="{
      container: 'xl:max-w-277.5 md:max-w-172.5 max-w-87.5',
      item: 'xl:basis-1/3 md:basis-1/2',
      next: 'bg-main-400 hover:bg-main-400/75 ring-0 hidden md:inline-flex',
      prev: 'bg-main-400 hover:bg-main-400/75 ring-0 hidden md:inline-flex',
      dot: 'bg-main-300 data-[state=active]:bg-main-400',
    }"
  >
    <ItemCard :product-info="product" @click="onItemClick" />
  </UCarousel>
</template>
