<script setup lang="ts">
const { pagination } = useCategoryPagination();

const isDismissible = ref(true);

const onCategorySubmit = (isUploading: boolean) => {
  isDismissible.value = !isUploading;
};
</script>

<template>
  <div class="max-w-[1110px] w-full flex flex-col grow items-end pt-[50px]">
    <h2 class="text-3xl font-bold text-[#333333] self-center">Категорії</h2>
    <div class="flex items-center gap-2.5">
      <UInput
        class="w-40 text-[#333333] border-b border-[#D6D6D6] no-spinner"
        :ui="{
          base: 'rounded-none bg-transparent h-[34px] text-[#333333] pl-0',
        }"
        variant="none"
        placeholder="Пошук..."
        v-model="pagination.search"
      />
      <UModal
        title="createCategory"
        description="createCategory"
        :ui="{
          content: 'bg-[#f0f0f0] rounded-none ring-[#333333] w-full',
          overlay: 'bg-[#f0f0f0b2]',
        }"
        :dismissible="isDismissible"
      >
        <UButton class="w-fit rounded-none" color="success"
          >Створити категорію</UButton
        >
        <template #content>
          <CreateCategoryForm @uploading="onCategorySubmit" />
        </template>
      </UModal>
    </div>
    <CategoryTable />
  </div>
</template>
