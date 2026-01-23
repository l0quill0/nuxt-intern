<script setup lang="ts">
import { getActive, updateOrder } from "~/api/orderApi";
import { PublicDynamicRoutes, UserRoutes } from "~/enums/routes.enum";
import type { IOrder } from "~/types/order.types";

const toast = useToast();
const modal = useOverlay();

const { data: response, refresh } = await getActive();

const cart = computed(() => response.value ?? ({} as IOrder));

const isSendEnabled = computed(() => cart.value && cart.value.items.length > 0);

async function onDataUpdate() {
  await refresh();
  await refreshNuxtData("count");
}

async function onClearClick() {
  try {
    await updateOrder(cart.value.id, { items: [] });
    await refresh();
    await refreshNuxtData("count");
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

async function onItemClick(id: number) {
  modal.closeAll();
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
}

async function onCreateClick() {
  modal.closeAll();
  navigateTo(UserRoutes.CREATEORDER);
}
</script>

<template>
  <UModal
    title="cart"
    description="cart"
    :ui="{
      content: 'ring-0',
      overlay: 'bg-[#f0f0f0b2]',
    }"
    class="h-screen w-10/12 lg:min-w-fit"
  >
    <template #content>
      <div
        class="flex flex-col bg-accent-50 lg:min-h-175 lg:min-w-275 h-full w-full justify-between"
      >
        <OrderItemTable
          v-if="cart"
          :order-id="cart.id"
          :items="cart.items"
          :qunatity-controls="true"
          @data-update="onDataUpdate"
          @item-click="onItemClick"
        />
        <div class="flex items-center justify-end gap-4 p-2.5 w-full flex-wrap">
          <span class="text-2xl tracking-widest">
            {{ `${cart?.total.toFixed(2)} ₴` }}
          </span>
          <div class="flex gap-1.25 lg:gap-4">
            <UButton
              color="main"
              @click="onCreateClick"
              class="pt-2.5 pb-2.5 lg:pl-5 lg:pr-5 text-white"
              :disabled="!isSendEnabled"
              >Створити замовлення</UButton
            >
            <UButton
              color="main"
              variant="outline"
              @click="onClearClick"
              class="pt-2.5 pb-2.5 lg:pl-5 lg:pr-5"
              :disabled="!isSendEnabled"
              >Очистити кошик</UButton
            >
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
