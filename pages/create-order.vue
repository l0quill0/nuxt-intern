<script setup lang="ts">
import { PublicDynamicRoutes } from "~/enums/routes.enum";

const cartItems = storeToRefs(useCartStore());

const onItemClick = async (id: number) => {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
};

const hasItems = computed(() => cartItems.items.value.length > 0);
</script>

<template>
  <div
    class="flex w-[80%] gap-7.5 pt-7.5 flex-col items-center xl:flex-row xl:items-start"
  >
    <OrderItemTable
      :items="cartItems.items.value"
      :qunatity-controls="true"
      @item-click="onItemClick"
    />
    <CreateOrderForm :has-items="hasItems" />
  </div>
</template>
