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
  <div class="w-full flex flex-col items-center pt-[135px]">
    <div class="max-w-[1110px] w-max flex flex-col items-center" v-if="item">
      <ItemInfo :item-info="item" @updateInfo="onItemUpdate" />
      <Suggestions :item-id="itemId" />
    </div>
  </div>
</template>
