<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { updateOrder } from "~/api/orderApi";
import type { IOrderProduct } from "~/types/order.types";

const props = defineProps<{
  items: IOrderProduct[];
  orderId: number;
  qunatityControls: boolean;
}>();
const emit = defineEmits<{
  (e: "dataUpdate"): void;
  (e: "itemClick", id: number): void;
}>();

const config = useRuntimeConfig();
const toast = useToast();

const parsedData = computed(() =>
  props.items.map((item) => ({
    id: item.product.id,
    title: item.product.title,
    image: `${config.public.bucketUrl}${item.product.image}`,
    quantity: item.quantity,
    price: item.product.price,
    total: item.quantity * item.product.price,
  })),
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
    let isInItems = false;
    const items = parsedData.value.map((item) => {
      if (item.id === id) {
        isInItems = true;
        return {
          productId: item.id,
          quantity: item.quantity + 1,
        };
      }
      return {
        productId: item.id,
        quantity: item.quantity + 1,
      };
    });

    if (!isInItems) items.push({ productId: id, quantity: 1 });

    await updateOrder(props.orderId, { items });
    emit("dataUpdate");
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

async function onRemoveClick(id: number) {
  try {
    const items = parsedData.value.map((item) => {
      if (item.id === id) {
        return {
          productId: item.id,
          quantity: item.quantity - 1,
        };
      }
      return {
        productId: item.id,
        quantity: item.quantity,
      };
    });

    await updateOrder(props.orderId, { items });
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
        class="w-12.5 h-12.5"
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
