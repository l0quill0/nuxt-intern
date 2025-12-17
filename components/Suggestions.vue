<script setup lang="ts">
import { getSuggestedItems } from "~/api/itemApi";

const props = defineProps({
  category: { type: String, required: true },
});

const { data: response } = getSuggestedItems(props.category);

const items = computed(() => response.value?.data ?? []);

function onItemClick(id: number) {
  navigateTo(`/item/${id}`);
}
</script>

<template>
  <h2 class="pt-[120px] text-[21px] leading-[1.4]">
    Ми підготували для вас щось особливе
  </h2>
  <h2 class="pt-[15px] text-3xl font-bold text-[#333333]">
    Товари які можуть вам сподобатись
  </h2>
  <div class="flex items-center pt-[60px] pb-5">
    <ItemCard v-for="item in items" :item-info="item" @click="onItemClick" />
  </div>
</template>
