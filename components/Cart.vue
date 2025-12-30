<script setup lang="ts">
import { clearCart, getCart } from "~/api/cartApi";
import {
  PublicDynamicRoutes,
  PublicRoutes,
  UserRoutes,
} from "~/enums/routes.enum";

const toast = useToast();
const modal = useOverlay();

const { data: cart, refresh } = await getCart();

const totalOrder = computed(
  () =>
    cart.value?.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) ?? 0
);

const isSendEnabled = computed(() => cart.value && cart.value.items.length > 0);

async function onDataUpdate() {
  await refresh();
  await refreshNuxtData("count");
}

async function onClearClick() {
  try {
    await clearCart();
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
        class="flex flex-col bg-accent-50 lg:min-h-[700px] lg:min-w-[1100px] h-full w-full justify-between"
      >
        <OrderItemTable
          v-if="cart"
          :items="cart.items"
          :qunatity-controls="true"
          @data-update="onDataUpdate"
          @item-click="onItemClick"
        />
        <div class="flex items-center justify-end gap-4 p-2.5 w-full flex-wrap">
          <span class="text-2xl tracking-widest">
            {{ `${totalOrder.toFixed(2)} ₴` }}
          </span>
          <div class="flex gap-[5px] lg:gap-4">
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
