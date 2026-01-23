<script setup lang="ts">
import { getActive } from "~/api/orderApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";

const { data: order, refresh } = await getActive();

const onDataUpdate = async () => {
  await refresh();
  await refreshNuxtData("count");
};

const onItemClick = async (id: number) => {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
};

const hasItems = computed(
  () => (order.value && order.value.items.length > 0) ?? false,
);
</script>

<template>
  <div
    class="flex w-[80%] gap-7.5 pt-7.5 flex-col items-center xl:flex-row xl:items-start"
  >
    <div v-if="order">
      <OrderItemTable
        :order-id="order.id"
        :items="Array.from(order.items)"
        :qunatity-controls="true"
        @data-update="onDataUpdate"
        @item-click="onItemClick"
      />
      <CreateOrderForm
        :order-id="order.id"
        @order-sent="onDataUpdate"
        :has-items="hasItems"
      />
    </div>
  </div>
</template>
