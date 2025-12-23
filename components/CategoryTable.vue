<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { deleteCategory, getPaginatedCategories } from "~/api/categoryApi";
import type { ICategory } from "~/types/category.type";
import UpdateCategoryForm from "./UpdateCategoryForm.vue";

const config = useRuntimeConfig();
const toast = useToast();
const overlay = useOverlay();
const updateModal = overlay.create(UpdateCategoryForm);

const { pagination } = useCategoryPagination();

pagination.value.pageSize = 8;

const { data: response, pending, refresh } = getPaginatedCategories(pagination);

const total = computed(() => response.value?.meta.totalItems ?? 0);

const totalPages = computed(() => response.value?.meta.totalPages ?? 0);

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

const openUpdateModalOpen = (id: number, name: string) => {
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
  <div
    class="flex flex-col items-center grow w-full pl-2.5 pr-2.5 lg:p-0"
    v-if="!isDeleting"
  >
    <UTable
      :loading="pending"
      :data="response?.data"
      :columns="tableColumns"
      empty="Категорій не знайдено"
      class="w-full grow"
      :ui="{
        th: 'text-main-400',
        tbody:
          '[&>tr]:data-[selectable=true]:hover:bg-accent-100 [&>tr]:data-[selectable=true]:duration-300 [&>tr]:border-b-0 [&>tr]:border-t [&>tr]hover:cursor-pointer',
        td: 'text-main-400 lg:max-w-16',
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
        <div class="flex gap-1.5 max-w-[180px] flex-col lg:flex-row">
          <UButton
            v-if="!row.original.immutable"
            @click="openUpdateModalOpen(row.original.id, row.original.name)"
            color="success"
            class="flex justify-center"
            >Оновити</UButton
          >
          <UButton
            v-if="!row.original.immutable"
            color="error"
            class="flex justify-center"
            @click="() => onRemoveClick(row.original.id)"
            >Видалити</UButton
          >
        </div>
      </template>
    </UTable>
    <UPagination
      color="main"
      active-color="main"
      :page="pagination.page"
      :items-per-page="pagination.pageSize"
      :total="total"
      @update:page="onPageChange"
      class="pt-2.5 pb-2.5"
      :ui="{
        item: 'aria-[current=page]:text-white duration:300',
      }"
    />
  </div>
</template>
