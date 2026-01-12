<script setup lang="ts">
import { getCart } from "~/api/cartApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";

const { data: order, refresh } = await getCart();

const onDataUpdate = async () => {
  await refresh();
  await refreshNuxtData("count");
};

const onItemClick = async (id: number) => {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
};

const hasItems = computed(
  () => (order.value && order.value.items.length > 0) ?? false
);
</script>

<template>
  <div
    class="flex w-[80%] gap-7.5 pt-7.5 flex-col items-center xl:flex-row xl:items-start"
  >
    <OrderItemTable
      v-if="order"
      :items="order?.items"
      :qunatity-controls="true"
      @data-update="onDataUpdate"
      @item-click="onItemClick"
    />
    <CreateOrderForm @order-sent="onDataUpdate" :has-items="hasItems" />
  </div>
</template>
