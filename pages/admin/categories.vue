<script setup lang="ts">
const { pagination } = useCategoryPagination();

const search = ref("");
const debouncedSearch = refDebounced(search, 500);

const isDismissible = ref(true);

const onCategorySubmit = (isUploading: boolean) => {
  isDismissible.value = !isUploading;
};

watch(debouncedSearch, (value) => {
  pagination.value.search = value;
});
</script>

<template>
  <div
    class="w-full flex flex-col grow items-end pt-5 gap-[25px] lg:pt-[50px] lg:pl-5 lg:pr-5 xl:pl-0 xl:pr-0 max-w-[1110px]"
  >
    <h2 class="text-3xl font-bold self-center">Категорії</h2>
    <div
      class="flex items-center gap-2.5 w-full lg:justify-end justify-between pl-2.5 pr-2.5 lg:p-0"
    >
      <UInput
        class="w-40 text-main-400 border-b border-accent-100 no-spinner"
        :ui="{
          base: 'rounded-none bg-transparent h-[34px] text-main-400 pl-0',
        }"
        variant="none"
        placeholder="Пошук..."
        v-model="search"
      />
      <UModal
        title="createCategory"
        description="createCategory"
        :ui="{
          overlay: 'bg-[#f0f0f0b2]',
        }"
        :dismissible="isDismissible"
      >
        <UButton color="success">Створити категорію</UButton>
        <template #content>
          <CreateCategoryForm @uploading="onCategorySubmit" />
        </template>
      </UModal>
    </div>
    <CategoryTable />
  </div>
</template>
