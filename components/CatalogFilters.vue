<script setup lang="ts">
import { isNumber } from "lodash";
import { getCategories } from "~/api/categoryApi";

const { data: categories } = await getCategories();
const { pagination } = useItemPagination();
const categoryItems = ref<Array<string>>([]);

const sortFieldItems = [
  { value: "title", label: "Назвою" },
  { value: "price", label: "Ціною" },
];

const sortOrderItems = {
  price: [
    { value: "asc", label: "Від дешевшого" },
    { value: "desc", label: "Від дорощого" },
  ],
  title: [
    { value: "asc", label: "Від А до Я" },
    { value: "desc", label: "Від Я до А" },
  ],
};

const formatInput = (value: string) => {
  const num = parseFloat(value);

  return Number.isFinite(num) && num > 0 ? num : undefined;
};

watchEffect(() => {
  if (categories.value) {
    categoryItems.value = categories.value.map((c) => c.name);
  }
});
</script>

<template>
  <div class="w-max flex gap-[30px]">
    <USelect
      :items="categoryItems.map((i) => i)"
      class="w-40 text-[#333333] border-b border-[#D6D6D6]"
      trailing-icon="custom:chevron"
      :ui="{
        base: 'rounded-none bg-transparent h-[34px] pl-0 ',
        placeholder: 'w-fit text-[#333333] ',
        content: 'rounded-none bg-white ring-0',
        item: 'text-[#333333] hover:bg-[#333333] hover:text-white before:rounded-none',
        trailing: 'pr-0',
        trailingIcon:
          'group-data-[state=open]:rotate-180 transition-transform duration-200 text-[#333333] w-3 h-2.5',
      }"
      variant="none"
      placeholder="Категорії"
      multiple
      v-model="pagination.category"
    >
    </USelect>
    <USelect
      class="w-40 text-[#333333] border-b border-[#D6D6D6]"
      trailing-icon="custom:chevron"
      :ui="{
        base: 'rounded-none bg-transparent h-[34px] pl-0 ',
        placeholder: 'w-fit text-[#333333]',
        content: 'rounded-none bg-white ring-0',
        item: 'text-[#333333] hover:bg-[#333333] hover:text-white before:rounded-none',
        trailing: 'pr-0',
        trailingIcon:
          'group-data-[state=open]:rotate-180 transition-transform duration-200 text-[#333333] w-3 h-2.5',
      }"
      variant="none"
      placeholder="Сортувати за"
      :items="sortFieldItems"
      v-model="pagination.sortBy"
    />
    <USelect
      class="w-40 text-[#333333] border-b border-[#D6D6D6]"
      trailing-icon="custom:chevron"
      :ui="{
        base: 'rounded-none bg-transparent h-[34px] pl-0 ',
        placeholder: 'w-fit text-[#333333]',
        content: 'rounded-none bg-white ring-0',
        item: 'text-[#333333] hover:bg-[#333333] hover:text-white before:rounded-none',
        trailing: 'pr-0',
        trailingIcon:
          'group-data-[state=open]:rotate-180 transition-transform duration-200 text-[#333333] w-3 h-2.5',
      }"
      variant="none"
      placeholder="Порядок"
      :items="sortOrderItems[pagination.sortBy as keyof typeof sortOrderItems]"
      v-model="pagination.sortOrder"
    />
    <UInput
      class="w-40 text-[#333333] border-b border-[#D6D6D6] no-spinner"
      :ui="{
        base: 'rounded-none bg-transparent h-[34px] text-[#333333] pl-0',
      }"
      type="number"
      min="0"
      variant="none"
      placeholder="Ціна від"
      @input="
        pagination.priceMin = formatInput(
          ($event.target as HTMLInputElement).value
        )
      "
    />
    <UInput
      class="w-40 text-[#333333] border-b border-[#D6D6D6] no-spinner"
      :ui="{
        base: 'rounded-none bg-transparent h-[34px] text-[#333333] pl-0',
      }"
      type="number"
      variant="none"
      placeholder="Ціна до"
      v-model="pagination.priceMax"
      @input="
        pagination.priceMax = formatInput(
          ($event.target as HTMLInputElement).value
        )
      "
    />
  </div>
</template>

<style>
.no-spinner input::-webkit-inner-spin-button,
.no-spinner input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
