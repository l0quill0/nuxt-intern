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
  <div v-if="items.length > 0" class="pt-[120px] flex flex-col items-center">
    <h2 class="text-[21px] leading-[1.4]">
      Ми підготували для вас щось особливе
    </h2>
    <h2 class="pt-[15px] text-3xl font-bold text-[#333333]">
      Товари які можуть вам сподобатись
    </h2>
  </div>
  <div class="flex items-center pt-[60px] pb-5 gap-[30px]">
    <ItemCard v-for="item in items" :item-info="item" @click="onItemClick" />
  </div>
</template>
