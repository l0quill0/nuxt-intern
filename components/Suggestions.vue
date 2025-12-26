<script setup lang="ts">
import { getSuggestedItems } from "~/api/itemApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";

const props = defineProps({
  itemId: { type: Number, required: true },
});

const { data: response } = getSuggestedItems(props.itemId, 6);

const items = computed(() => response.value ?? []);

function onItemClick(id: number) {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
}
</script>

<template>
  <div
    v-if="items.length > 0"
    class="pt-5 xl:pt-[120px] flex flex-col items-center"
  >
    <h2 class="text-[21px] leading-[1.4] text-center">
      Ми підготували для вас щось особливе
    </h2>
    <h2 class="pt-[15px] text-3xl font-bold text-center">
      Товари які можуть вам сподобатись
    </h2>
  </div>
  <UCarousel
    v-if="items.length > 0"
    v-slot="{ item }"
    :items="items"
    loop
    arrows
    dots
    wheel-gestures
    class=""
    :ui="{
      container: 'xl:max-w-[1110px] md:max-w-[690px] max-w-[350px]',
      item: 'xl:basis-1/3 md:basis-1/2',
      next: 'bg-main-400 hover:bg-main-400/75 ring-0 hidden md:inline-flex',
      prev: 'bg-main-400 hover:bg-main-400/75 ring-0 hidden md:inline-flex',
      dot: 'bg-main-300 data-[state=active]:bg-main-400',
    }"
  >
    <ItemCard :item-info="item" @click="onItemClick" />
  </UCarousel>
</template>
