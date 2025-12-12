<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { getPaginatedItems, removeItem } from "~/api/itemApi";
import type { IItem } from "~/Types/item.type";

const config = useRuntimeConfig();
const route = useRoute();
const { pagination } = useItemPagination();

const UButton = resolveComponent("UButton");

const items = ref<IItem[]>();
const toast = useToast();
const total = ref(0);
const totalPages = ref(0);

watch(
  () => route.query,
  () => loadItems(),
  { deep: true, immediate: true }
);

async function loadItems() {
  try {
    const response = await getPaginatedItems(route.query);
    items.value = response.data;
    total.value = response.meta.totalItems;
    totalPages.value = response.meta.totalPages;
  } catch (error) {}
}

const onItemClick = (id: number) => {
  navigateTo(`/item/${id}`);
};

const onRemoveClick = async (id: number) => {
  try {
    await removeItem(id);
    await loadItems();
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
    header: "tesr",
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
</script>

<template>
  <div class="flex flex-col items-center grow">
    <CatalogFilters />
    <UTable
      :loading="!items"
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
          :placeholder="'/no-image.png'"
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
