<script setup lang="ts">
import { getCategories } from "~/api/categoryApi";
import { refDebounced } from "@vueuse/core";

const { pagination } = useItemPagination();

const { data: categories } = getCategories();

const priceMin = ref(pagination.value.priceMin);
const priceMax = ref(pagination.value.priceMax);
const priceMinDebounced = refDebounced(priceMin, 500);
const priceMaxDebounced = refDebounced(priceMax, 500);

const categoryItems = computed<{ label: string; value: string }[]>(
  () =>
    categories.value?.map((c) => ({
      label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
      value: c.slug,
    })) ?? []
);

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

const beforeInput = (e: InputEvent) => {
  const input = e.target as HTMLInputElement;

  if (!e.data) return;
  if (!/^[0-9.]$/.test(e.data)) {
    e.preventDefault();
    return;
  }

  if (!/^([0-9]*\.[0-9]{1,2}|[0-9]+\.?)$/.test(input.value + e.data)) {
    e.preventDefault();
    return;
  }
};

const onSortByChange = () => {
  pagination.value.sortOrder = "asc";
};

watch(priceMinDebounced, (value) => {
  if (Number(value) > 0) {
    pagination.value.priceMin = Number(value);
  } else {
    pagination.value.priceMin = undefined;
    priceMin.value = undefined;
  }
});
watch(priceMaxDebounced, (value) => {
  if (Number(value) > 0) {
    pagination.value.priceMax = Number(value);
  } else {
    pagination.value.priceMax = undefined;
    priceMax.value = undefined;
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
      value-key="value"
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
      @change="onSortByChange"
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
      :disabled="!pagination.sortBy"
      :items="sortOrderItems[pagination.sortBy as keyof typeof sortOrderItems]"
      v-model="pagination.sortOrder"
    />
    <UInput
      class="w-40 text-[#333333] border-b border-[#D6D6D6] no-spinner"
      :ui="{
        base: 'rounded-none bg-transparent h-[34px] text-[#333333] pl-0',
      }"
      variant="none"
      placeholder="Ціна від"
      v-model="priceMin"
      @beforeinput="beforeInput"
    />
    <UInput
      class="w-40 text-[#333333] border-b border-[#D6D6D6] no-spinner"
      :ui="{
        base: 'rounded-none bg-transparent h-[34px] text-[#333333] pl-0',
      }"
      type="text"
      variant="none"
      placeholder="Ціна до"
      v-model="priceMax"
      @beforeinput="beforeInput"
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
