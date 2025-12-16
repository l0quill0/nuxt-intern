<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { getPaginatedItems, removeItem, restoreItem } from "~/api/itemApi";
import type { IItem } from "~/Types/item.type";
import UpdateItemForm from "./UpdateItemForm.vue";

const config = useRuntimeConfig();
const { pagination } = useItemPagination();

const UButton = resolveComponent("UButton");

const toast = useToast();

const overlay = useOverlay();
const updateModal = overlay.create(UpdateItemForm);

const { data: response, pending, refresh } = getPaginatedItems(pagination);

const items = computed(() => response.value?.data ?? []);

const total = computed(() => response.value?.meta.totalItems ?? 0);

const totalPages = computed(() => response.value?.meta.totalPages ?? 0);

const onItemClick = (id: number) => {
  navigateTo(`/item/${id}`);
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
  if (page < 1 || page > totalPages.value) return;
  pagination.value.page = page;
};

type TableRow = IItem;

const tableColumns: TableColumn<TableRow>[] = [
  { accessorKey: "title", header: "Назва" },
  {
    accessorKey: "image",
    header: "",
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
          '[&>tr]:data-[selectable=true]:hover:bg-stone-300 [&>tr]:data-[selectable=true]:duration-300',
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
      :page="pagination.page"
      :items-per-page="pagination.pageSize"
      :total="total"
      @update:page="onPageChange"
      class="pt-2.5 pb-2.5"
      :ui="{
        item: 'rounded-none bg-transparent active:bg-transparent hover:text-white  hover:bg-[#333333] text-[#333333] ring-0',
        first: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        last: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        next: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        prev: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
      }"
    />
  </div>
</template>
