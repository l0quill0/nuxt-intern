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
  <div class="w-fit flex flex-col items-end gap-2.5 pt-[50px] h-full">
    <div class="flex gap-2.5 items-center">
      <UCheckbox
        v-model="showRemoved"
        label="Включити видалені"
        :ui="{
          label: 'text-[#333333]',
          base: 'rounded-none hover:cursor-pointer',
          indicator: 'bg-[#333333] text-white ',
        }"
      />
      <UModal
        title="createItem"
        description="createItem"
        :ui="{
          content: 'bg-[#f0f0f0] rounded-none ring-[#333333] w-full',
          overlay: 'bg-[#f0f0f0b2]',
        }"
        :dismissible="isDismissible"
      >
        <UButton class="w-fit" color="success">Створити товар</UButton>
        <template #content>
          <CreateItemForm @uploading="onItemSubmit" />
        </template>
      </UModal>
    </div>
    <ItemTable />
  </div>
</template>
