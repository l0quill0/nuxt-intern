<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { getPaginatedItems, removeItem } from "~/api/itemApi";
import type { IItem } from "~/Types/item.type";

const config = useRuntimeConfig();

const route = useRoute();
const { pagination } = useItemPagination();
const UButton = resolveComponent("UButton");

const items = ref<IItem[]>([]);
const toast = useToast();
let total = 0;
let totalPages = 0;

const onPageChange = (page: number) => {
  if (page < 1 || page > totalPages) return;
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
    accessorKey: "categoryName",
    header: "Категорія",
  },
  {
    id: "controls",
    header: "Дії",
  },
];

watch(
  () => route.query,
  () => loadItems(),
  { deep: true, immediate: true }
);

function onItemClick(id: number) {
  navigateTo(`/item/${id}`);
}

const onRemoveClick = async (id: number) => {
  try {
    await removeItem(id);
    await loadItems();
    toast.add({ title: "Товар видалено", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
};

async function loadItems() {
  try {
    const response = await getPaginatedItems(route.query);
    items.value = response.data;
    total = response.meta.totalItems;
    totalPages = response.meta.totalPage;
  } catch (error) {}
}

await loadItems();
</script>

<template>
  <div class="flex flex-col items-center grow">
    <CatalogFilters />
    <UTable
      :loading="!items"
      :data="items"
      @select="(e, row) => onItemClick(row.original.id)"
      :columns="tableColumns"
      class="w-full grow"
      :ui="{
        th: 'text-[#333333]',
        tbody:
          '[&>tr]:data-[selectable=true]:hover:bg-stone-300 [&>tr]:data-[selectable=true]:duration-300',
      }"
    >
      <template #controls-cell="{ row }">
        <div class="flex gap-1.5">
          <UModal
            :aria-describedby="undefined"
            description="ItemUpdate"
            title="ItemUpdate"
            :ui="{
              content: 'rounded-none',
              overlay: 'bg-[#f0f0f0b2]',
            }"
          >
            <UButton
              @click.stop
              class="rounded-none bg-[#333333] text-white hover:bg-gray-500 active:bg-gray-700"
              >Оновити</UButton
            >

            <template #content>
              <UpdateItemForm :item-id="row.original.id" />
            </template>
          </UModal>
          <UButton
            @click.stop
            class="rounded-none"
            color="error"
            @click="() => onRemoveClick(row.original.id)"
          >
            Видалити
          </UButton>
        </div>
      </template>
      <template #image-cell="{ row }">
        <NuxtImg
          :src="`${config.public.bucketUrl}${row.original.image}`"
          class="w-[75px] h-[75px]"
        />
      </template>
      <template #price-cell="{ row }">
        <span>{{ `${row.original.price.toFixed(2)} ₴` }}</span>
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
