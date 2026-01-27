<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { deleteCategory, getPaginatedCategories } from "~/api/categoryApi";
import type { ICategory } from "~/types/category.types";
import UpdateCategoryForm from "./UpdateCategoryForm.vue";

const config = useRuntimeConfig();
const toast = useToast();
const overlay = useOverlay();
const updateModal = overlay.create(UpdateCategoryForm);

const { pagination } = useCategoryPagination();

pagination.value.pageSize = 8;

const { data: response, pending, refresh } = getPaginatedCategories(pagination);

const total = computed(() =>
  response.value?.totalPages && pagination.value.pageSize
    ? response.value.totalPages * pagination.value.pageSize
    : 0,
);

const totalPages = computed(() => response.value?.totalPages ?? 0);

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

const openUpdateModalOpen = (slug: string) => {
  updateModal.open({ slug });
};

const onPageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  pagination.value.page = page;
};

const onRemoveClick = async (slug: string) => {
  try {
    isDeleting.value = true;
    await deleteCategory(slug);
    await refresh();
    toast.add({ title: "Категорія видалена", color: "success" });
    isDeleting.value = false;
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
    isDeleting.value = false;
  }
};
</script>

<template>
  <div v-if="isDeleting" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-xl h-25 w-25"></span>
  </div>
  <div
    class="flex flex-col items-center grow w-full pl-2.5 pr-2.5 lg:p-0"
    v-if="!isDeleting"
  >
    <UTable
      :loading="pending"
      :data="response?.items"
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
      <template #name-cell="{ row }">
        {{
          row.original.name.charAt(0).toUpperCase() + row.original.name.slice(1)
        }}
      </template>
      <template #image-cell="{ row }">
        <NuxtImg
          :key="row.original.id"
          :src="`${config.public.bucketUrl}${row.original.image}`"
          :placeholder="'/no-image.png'"
          class="w-12.5 h-12.5"
        />
      </template>
      <template #controls-cell="{ row }">
        <div class="flex gap-1.5 max-w-45 flex-col lg:flex-row">
          <UButton
            @click="openUpdateModalOpen(row.original.slug)"
            color="success"
            class="flex justify-center"
            >Оновити</UButton
          >
          <UButton
            color="error"
            class="flex justify-center"
            @click="() => onRemoveClick(row.original.slug)"
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
