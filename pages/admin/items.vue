<script setup lang="ts">
const showRemoved = ref<boolean>(false);
const { pagination } = useItemPagination();
watch(showRemoved, () => {
  pagination.value.showRemoved = String(showRemoved.value);
});
</script>

<template>
  <div class="w-fit flex flex-col items-end gap-2.5 pt-[50px] h-full">
    <div class="flex gap-2.5 items-center">
      <UCheckbox
        v-model="showRemoved"
        label="Включити видалені"
        :ui="{
          label: 'text-[#333333]',
          base: 'rounded-none',
          indicator: 'bg-[#333333] text-white',
        }"
      />
      <UModal
        title="createCategory"
        description="createCategory"
        :ui="{
          content: 'bg-[#f0f0f0] rounded-none ring-[#333333] w-full',
          overlay: 'bg-[#f0f0f0b2]',
        }"
      >
        <UButton class="w-fit rounded-none" color="success"
          >Створити категорію</UButton
        >
        <template #content>
          <CreateCategoryForm />
        </template>
      </UModal>
      <UModal
        title="removeCategory"
        description="removeCategory"
        :ui="{
          content:
            'bg-[#f0f0f0] rounded-none ring-[#333333] max-w-[350px] w-full',
          overlay: 'bg-[#f0f0f0b2]',
        }"
      >
        <UButton class="w-fit rounded-none" color="error"
          >Видалити категорію</UButton
        >
        <template #content>
          <RemoveCategory />
        </template>
      </UModal>
      <UModal
        title="createItem"
        description="createItem"
        :ui="{
          content: 'bg-[#f0f0f0] rounded-none ring-[#333333] w-full',
          overlay: 'bg-[#f0f0f0b2]',
        }"
      >
        <UButton class="w-fit rounded-none" color="success"
          >Створити товар</UButton
        >
        <template #content>
          <CreateItemForm />
        </template>
      </UModal>
    </div>
    <ItemTable />
  </div>
</template>
