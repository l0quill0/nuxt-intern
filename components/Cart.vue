<script setup lang="ts">
import { PublicDynamicRoutes, PublicRoutes } from "~/enums/routes.enum";

const toast = useToast();
const modal = useOverlay();
const { isAuth } = storeToRefs(useTokenStore());

const { clear, fetchItems } = useCartStore();

const cartItems = storeToRefs(useCartStore());

await fetchItems();

const isSendable = computed(() => cartItems.cart.value.items.length > 0);

async function onClearClick() {
  try {
    await clear();
    if (isAuth.value) {
      await refreshNuxtData("count");
    }
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
  }
}

async function onItemClick(id: number) {
  modal.closeAll();
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
}

async function onCreateClick() {
  modal.closeAll();
  navigateTo(PublicRoutes.CREATEORDER);
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
          :items="cartItems.items.value"
          :qunatity-controls="true"
          @item-click="onItemClick"
        />
        <div class="flex items-center justify-end gap-4 p-2.5 w-full flex-wrap">
          <span class="text-2xl tracking-widest">{{
            `${cartItems.total.value.toFixed(2)} ₴`
          }}</span>
          <div class="flex gap-1.25 lg:gap-4">
            <UButton
              color="main"
              @click="onCreateClick"
              class="pt-2.5 pb-2.5 lg:pl-5 lg:pr-5 text-white"
              :disabled="!isSendable"
              >Створити замовлення</UButton
            >
            <UButton
              color="main"
              variant="outline"
              @click="onClearClick"
              class="pt-2.5 pb-2.5 lg:pl-5 lg:pr-5"
              :disabled="!isSendable"
              >Очистити кошик</UButton
            >
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
