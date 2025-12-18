<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { deleteCategory, getPaginatedCategories } from "~/api/categoryApi";
import type { ICategory } from "~/types/category.type";
import UpdateCategoryForm from "./UpdateCategoryForm.vue";

const { pagination } = useCategoryPagination();

pagination.value.pageSize = 8;

const config = useRuntimeConfig();
const toast = useToast();
const overlay = useOverlay();
const updateModal = overlay.create(UpdateCategoryForm);

const isDeleting = ref(false);

type TableRow = ICategory;

const tableColumns: TableColumn<TableRow>[] = [
  {
    accessorKey: "name",
    header: "Назва",
  },
  {
    accessorKey: "image",
    header: "Зображення",
  },
  {
    id: "controls",
    header: "Дії",
  },
];

const { data: response, pending, refresh } = getPaginatedCategories(pagination);

const total = computed(() => response.value?.meta.totalItems ?? 0);

const totalPages = computed(() => response.value?.meta.totalPages ?? 0);

const openUpdateModal = (id: number, name: string) => {
  updateModal.open({ id });
};

const onPageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  pagination.value.page = page;
};

const onRemoveClick = async (id: number) => {
  try {
    isDeleting.value = true;
    await deleteCategory(id);
    await refresh();
    toast.add({ title: "Категорія видалена", color: "success" });
    isDeleting.value = false;
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
    isDeleting.value = false;
  }
};
</script>

<template>
  <div v-if="isDeleting" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-xl h-[100px] w-[100px]"></span>
  </div>
  <div class="flex flex-col items-center grow w-full" v-if="!isDeleting">
    <UTable
      :loading="pending"
      :data="response?.data"
      :columns="tableColumns"
      empty="Категорій не знайдено"
      class="w-full grow"
      :ui="{
        th: 'text-[#333333]',
        tbody:
          '[&>tr]:data-[selectable=true]:hover:bg-stone-300 [&>tr]:data-[selectable=true]:duration-300',
        td: 'text-[#333333] max-w-16',
      }"
    >
      <template #image-cell="{ row }">
        <NuxtImg
          :key="row.original.id"
          :src="`${config.public.bucketUrl}${row.original.image}`"
          :placeholder="'/no-image.png'"
          class="w-[50px] h-[50px]"
        />
      </template>
      <template #controls-cell="{ row }">
        <div class="flex gap-1.5 max-w-[180px]">
          <UButton
            v-if="!row.original.immutable"
            @click="openUpdateModal(row.original.id, row.original.name)"
            class="rounded-none"
            color="success"
            >Оновити</UButton
          >
          <UButton
            v-if="!row.original.immutable"
            class="rounded-none"
            color="error"
            @click="() => onRemoveClick(row.original.id)"
            >Видалити</UButton
          >
        </div>
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
