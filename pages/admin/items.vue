<script setup lang="ts">
const showRemoved = ref<boolean>(false);
const { pagination, isInfiniteScroll } = useItemPagination();

isInfiniteScroll.value = false;

const isDismissible = ref(true);

const onItemSubmit = (isUploading: boolean) => {
  isDismissible.value = !isUploading;
};

watch(
  () => showRemoved.value,
  () => {
    pagination.value.showRemoved = showRemoved.value
      ? String(showRemoved.value)
      : undefined;
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="w-full lg:w-fit flex flex-col items-center lg:items-end gap-2.5 pt-5 lg:pt-12.5 h-full"
  >
    <div
      class="flex gap-2.5 justify-between lg:justify-end items-center w-full px-2.5 lg:p-0"
    >
      <UCheckbox
        v-model="showRemoved"
        label="Включити видалені"
        :ui="{
          label: 'text-main-400',
          base: 'rounded-none hover:cursor-pointer',
          indicator: 'bg-main-400 text-white ',
        }"
      />
      <UModal
        title="createItem"
        description="createItem"
        :ui="{
          overlay: 'bg-[#f0f0f0b2]',
        }"
        :dismissible="isDismissible"
      >
        <UButton color="success">Створити товар</UButton>
        <template #content>
          <CreateItemForm @uploading="onItemSubmit" />
        </template>
      </UModal>
    </div>
    <ItemTable />
  </div>
</template>
