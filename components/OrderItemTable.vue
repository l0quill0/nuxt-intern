<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { addToCart, removeFromCart } from "~/api/cartApi";
import type { IOrderItem } from "~/types/order.item.type";

const props = defineProps<{ items: IOrderItem[]; qunatityControls: boolean }>();
const emit = defineEmits<{
  (e: "dataUpdate"): void;
  (e: "itemClick", id: number): void;
}>();

const config = useRuntimeConfig();
const toast = useToast();

const parsedData = computed(() =>
  props.items.map((item) => ({
    id: item.id,
    title: item.title,
    image: `${config.public.bucketUrl}${item.image}`,
    quantity: item.quantity,
    price: item.price,
    total: item.quantity * item.price,
  }))
);

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

async function onAddClick(id: number) {
  try {
    await addToCart(id);
    emit("dataUpdate");
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

async function onRemoveClick(id: number) {
  try {
    await removeFromCart(id, 1);
    emit("dataUpdate");
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}
</script>

<template>
  <UTable
    :columns="tableColumns"
    :data="parsedData"
    :ui="{
      th: 'bg-main-400 ',
      td: 'text-main-400 text-xl',
      tr: 'border-b border-accent-100 pl-2.5',
      tbody: 'border-0 ',
      separator: 'hidden',
      tbody:
        '[&>tr]:data-[selectable=true]:hover:bg-accent-100 [&>tr]:data-[selectable=true]:duration-300 [&>tr]:border-b-0 [&>tr]:border-t [&>tr]:hover:cursor-pointer',
    }"
    class="w-full h-full"
    @select="(e, row) => emit('itemClick', row.original.id)"
    empty="Список пустий"
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
        v-if="qunatityControls"
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
        v-if="qunatityControls"
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
</template>
