<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { getPaginatedItems, removeItem, restoreItem } from "~/api/itemApi";
import type { IItem } from "~/types/item.type";
import UpdateItemForm from "./UpdateItemForm.vue";
import { PublicDynamicRoutes } from "~/enums/routes.enum";

const config = useRuntimeConfig();
const UButton = resolveComponent("UButton");
const toast = useToast();
const overlay = useOverlay();
const updateModal = overlay.create(UpdateItemForm);

const { pagination } = useItemPagination();

const { data: response, pending, refresh } = getPaginatedItems(pagination);

const items = computed(() => response.value?.data ?? []);
const page = computed(() => pagination.value.page ?? 1);
const pageSize = computed(() => pagination.value.pageSize ?? 6);
const total = computed(() => response.value?.meta.totalItems ?? 0);
const totalPages = computed(() => response.value?.meta.totalPages ?? 0);

const onItemClick = (id: number) => {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
};

const openUpdateModal = (id: number) => {
  updateModal.open({ itemId: id });
};

const onReturnClick = async (id: number) => {
  try {
    await restoreItem(id);
    await refresh();
    toast.add({ title: "Товар відновлено", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
};

const onRemoveClick = async (id: number) => {
  try {
    await removeItem(id);
    await refresh();
    toast.add({ title: "Товар видалено", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
};

const onPageChange = (page: number) => {
  if (page < 2) {
    pagination.value.page = undefined;
  } else if (page <= totalPages.value) {
    pagination.value.page = page;
  }
};

type TableRow = IItem;

const tableColumns: TableColumn<TableRow>[] = [
  { accessorKey: "title", header: "Назва" },
  {
    accessorKey: "image",
    header: "Зображення",
  },
  {
    accessorKey: "price",
    header: "Ціна",
  },
  {
    accessorKey: "category",
    header: "Категорія",
  },
  {
    id: "controls",
    header: "Дії",
  },
];
</script>

<template>
  <div class="flex flex-col items-center grow">
    <CatalogFilters />
    <UTable
      :loading="pending"
      :data="items"
      @select="(e, row) => onItemClick(row.original.id)"
      :columns="tableColumns"
      empty="Товарів не знайдено"
      class="w-full grow"
      :ui="{
        th: 'text-[#333333]',
        tbody:
          '[&>tr]:data-[selectable=true]:hover:bg-stone-300 [&>tr]:data-[selectable=true]:duration-300 [&>tr]:border-b-0 [&>tr]:border-t [&>tr]:hover:cursor-pointer',
        td: 'text-[#333333] max-w-28',
      }"
    >
      <template #controls-cell="{ row }">
        <div class="flex gap-1.5 max-w-[180px]">
          <UButton
            v-if="!row.original.isRemoved"
            @click.stop
            @click="openUpdateModal(row.original.id)"
            class="rounded-none"
            color="success"
            >Оновити</UButton
          >
          <UButton
            v-if="!row.original.isRemoved"
            @click.stop
            class="rounded-none"
            color="error"
            @click="() => onRemoveClick(row.original.id)"
          >
            Видалити
          </UButton>
          <UButton
            v-if="row.original.isRemoved"
            @click.stop
            class="rounded-none"
            color="success"
            @click="() => onReturnClick(row.original.id)"
          >
            Повернути
          </UButton>
        </div>
      </template>
      <template #image-cell="{ row }">
        <NuxtImg
          :key="row.original.id"
          :src="`${config.public.bucketUrl}${row.original.image}`"
          class="w-[75px] h-[75px]"
          :placeholder="'/no-image.png'"
        />
      </template>
      <template #price-cell="{ row }">
        <span>{{ `${row.original.price.toFixed(2)} ₴` }}</span>
      </template>
      <template #category-cell="{ row }">
        <span>{{
          row.original.category.name.charAt(0).toUpperCase() +
          row.original.category.name.slice(1)
        }}</span>
      </template>
    </UTable>
    <UPagination
      :page="page"
      :items-per-page="pageSize"
      :total="total"
      @update:page="onPageChange"
      class="pt-2.5 pb-2.5"
      :ui="{
        item: 'rounded-none bg-transparent active:bg-transparent active:text-[#333333] hover:text-white  hover:bg-[#333333] text-[#333333] ring-0 aria-[current=page]:bg-[#333333] aria-[current=page]:text-white duration:300',
        first: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        last: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        next: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        prev: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
      }"
    />
  </div>
</template>
