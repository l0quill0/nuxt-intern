<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { IOrderProduct } from "~/types/order.types";

const props = defineProps<{
  items: IOrderProduct[];
  orderId?: number;
  qunatityControls: boolean;
}>();

const emit = defineEmits<{
  (e: "itemClick", id: number): void;
}>();

const toast = useToast();
const config = useRuntimeConfig();
const { updateItems } = useCartStore();
const { isAuth } = storeToRefs(useTokenStore());

const parsedData = computed(() =>
  props.items.map((item) => ({
    id: item.product.id,
    title: item.product.title,
    price: item.product.price,
    total: item.quantity * item.product.price,
    image: `${config.public.bucketUrl}${item.product.image}`,
    quantity: item.quantity,
  })),
);

type tableRow = {
  id: number;
  title: string;
  image: string;
  price: number;
  total: number;
  quantity: number;
};

const tableColumns: TableColumn<tableRow>[] = [
  { accessorKey: "title", header: "Товар" },
  { accessorKey: "image", header: "Фото" },
  { accessorKey: "quantity", header: "Кількість" },
  { accessorKey: "total", header: "Загалом" },
];

async function onAddClick(id: number) {
  try {
    updateItems({ productId: id, quantity: 1 });
    if (isAuth.value) {
      await refreshNuxtData("count");
    }
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
  }
}

async function onRemoveClick(id: number) {
  try {
    updateItems({ productId: id, quantity: -1 });
    if (isAuth.value) {
      await refreshNuxtData("count");
    }
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
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
