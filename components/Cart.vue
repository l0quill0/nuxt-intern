<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { addToCart, clearCart, getCart, removeFromCart } from "~/api/cartApi";
import { createOrder } from "~/api/orderApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";

const config = useRuntimeConfig();
const toast = useToast();

const parsedData = ref<tableRow[]>([]);
const totalOrder = ref(0);
const isSendDisabled = ref(true);

const { data, refresh } = await getCart();

watch(
  data,
  (newData) => {
    if (newData) {
      parsedData.value = newData.items.map((item) => ({
        id: item.id,
        title: item.title,
        image: `${config.public.bucketUrl}${item.image}`,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      }));
      totalOrder.value = newData.total;
      isSendDisabled.value = !parsedData.value.length;
    }
  },
  { immediate: true }
);

async function onClearClick() {
  try {
    await clearCart();
    totalOrder.value = 0;
    await refresh();
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

async function onAddClick(id: number) {
  try {
    await addToCart(id);
    await refresh();
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

async function onRemoveClick(id: number) {
  try {
    await removeFromCart(id, 1);
    await refresh();
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

async function onCreateClick() {
  try {
    await createOrder();
    await refresh();
    await refreshNuxtData("orderPagination");
    toast.add({ title: "Замовлення створено", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

type tableRow = {
  id: number;
  title: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
};

const tableColumns: TableColumn<tableRow>[] = [
  { accessorKey: "title", header: "Товар" },
  { accessorKey: "image", header: "Фото" },
  { accessorKey: "quantity", header: "Кількість" },
  { accessorKey: "total", header: "Загалом" },
];
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
        <UTable
          :data="parsedData"
          :columns="tableColumns"
          :ui="{
            th: 'bg-main-400 ',
            td: 'text-main-400 text-xl',
            tr: 'border-b border-accent-100 pl-2.5',
            tbody: 'border-0 ',
            separator: 'hidden',
          }"
          class="w-full h-full"
          empty="Кошик пустий"
        >
          <template #image-cell="{ row }">
            <NuxtImg
              :key="row.original.id"
              :src="row.original.image"
              @error=""
              class="w-[50px] h-[50px]"
              :placeholder="'/no-image.png'"
            />
          </template>
          <template #quantity-cell="{ row }">
            <UButton
              variant="ghost"
              color="main"
              @click="onRemoveClick(row.original.id)"
              class="mr-2"
              >-</UButton
            >
            <span>{{
              `${row.original.quantity} * ${row.original.price.toFixed(2)} ₴`
            }}</span>
            <UButton
              variant="ghost"
              color="main"
              @click="onAddClick(row.original.id)"
              class="ml-2"
              >+</UButton
            >
          </template>
          <template #total-cell="{ row }">
            <span>{{ `${row.original.total.toFixed(2)} ₴` }}</span>
          </template>
        </UTable>
        <div class="flex items-center justify-end gap-4 p-2.5 w-full flex-wrap">
          <span class="text-2xl tracking-widest">
            {{ `${totalOrder.toFixed(2)} ₴` }}
          </span>
          <div class="flex gap-[5px] lg:gap-4">
            <UButton
              color="main"
              @click="onCreateClick"
              class="pt-2.5 pb-2.5 lg:pl-5 lg:pr-5 text-white"
              :disabled="isSendDisabled"
              >Створити замовлення</UButton
            >
            <UButton
              color="main"
              variant="outline"
              @click="onClearClick"
              class="pt-2.5 pb-2.5 lg:pl-5 lg:pr-5"
              :disabled="isSendDisabled"
              >Очистити кошик</UButton
            >
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
