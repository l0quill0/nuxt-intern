<script setup lang="ts">
import { getItemById } from "~/api/itemApi";

const route = useRoute();

const itemId = Number(route.params.id);

const { data: response, refresh } = getItemById(itemId);

const item = computed(() => response.value);

const onItemUpdate = async () => {
  await refresh();
};
</script>

<template>
  <div
    class="flex flex-col items-center pt-6.25 lg:pt-33.75 pl-2.5 pr-2.5 lg:pl-0 lg:pr-0 w-full"
  >
    <div class="flex flex-col items-center" v-if="item">
      <ItemInfo :item-info="item" @updateInfo="onItemUpdate" />
      <Suggestions :item-id="itemId" />
    </div>
  </div>
</template>
