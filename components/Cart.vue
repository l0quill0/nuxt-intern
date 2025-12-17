<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { addToCart, clearCart, getCart, removeFromCart } from "~/api/cartApi";
import { createOrder } from "~/api/orderApi";

const config = useRuntimeConfig();
const toast = useToast();

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
  { accessorKey: "image", header: "" },
  { accessorKey: "quantity", header: "Кількість" },
  { accessorKey: "total", header: "Ціна" },
];

const parsedData = ref<tableRow[]>([]);
const totalOrder = ref(0);

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

const { data, refresh } = await getCart();

let isSendDisabled = true;

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
      isSendDisabled = !parsedData.value.length;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <UTable
      :data="parsedData"
      :columns="tableColumns"
      :ui="{
        th: 'bg-[#333333] ',
        td: 'text-[#333333] text-xl',
        tr: 'border-b border-[#D6D6D6]',
        tbody: 'border-0',
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
          class="w-[75px] h-[75px]"
          :placeholder="'/no-image.png'"
        />
      </template>
      <template #quantity-cell="{ row }">
        <UButton
          @click="onRemoveClick(row.original.id)"
          class="rounded-none mr-2 bg-transparent hover:bg-transparent hover:border-[#333333] border border-transparent active:bg-[#333333] active:text-[#f0f0f0]"
          >-</UButton
        >
        <span>{{
          `${row.original.quantity} * ${row.original.price.toFixed(2)} ₴`
        }}</span>
        <UButton
          @click="onAddClick(row.original.id)"
          class="rounded-none ml-2 bg-transparent hover:bg-transparent hover:border-[#333333] border border-transparent active:bg-[#333333] active:text-[#f0f0f0]"
          >+</UButton
        >
      </template>
      <template #total-cell="{ row }">
        <span>{{ `${row.original.total.toFixed(2)} ₴` }}</span>
      </template>
    </UTable>
    <div class="flex items-center justify-end gap-4 p-2.5">
      <span class="text-2xl text-[#333333] tracking-widest">
        {{ `${totalOrder.toFixed(2)} ₴` }}
      </span>
      <UButton
        @click="onCreateClick"
        class="rounded-none bg-[#333333] border border-[#333333] pt-2.5 pb-2.5 pl-5 pr-5 hover:bg-gray-500 active:bg-gray-600 text-white disabled:bg-gray-500 duration-300"
        :disabled="isSendDisabled"
        >Створити замовлення</UButton
      >
      <UButton
        @click="onClearClick"
        class="rounded-none bg-[#F9F9F9] border border-[#333333] pt-2.5 pb-2.5 pl-5 pr-5 hover:bg-gray-500 active:bg-gray-600 duration-300 disabled:bg-slate-300"
        :disabled="isSendDisabled"
        >Очистити кошик</UButton
      >
    </div>
  </div>
</template>
