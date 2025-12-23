<script setup lang="ts">
import { getSuggestedItems } from "~/api/itemApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";

const props = defineProps({
  itemId: { type: Number, required: true },
});

const { data: response } = getSuggestedItems(props.itemId);

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
  <div
    class="flex flex-col lg:flex-row items-center pt-5 xl:pt-[60px] pb-5 gap-[30px]"
  >
    <template v-for="(item, index) in items" :key="item.id">
      <ItemCard :item-info="item" @click="onItemClick" />
      <div
        v-if="index + 1 !== items.length"
        class="w-full h-px bg-accent-100 my-[30px] lg:hidden"
      ></div>
    </template>
  </div>
</template>
