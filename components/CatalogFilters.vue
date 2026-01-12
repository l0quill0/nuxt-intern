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
  <div
    class="w-full justify-center flex flex-wrap gap-1.5 lg:gap-7.5 p-2.5 lg:p-0"
  >
    <USelect
      :items="categoryItems.map((i) => i)"
      class="lg:w-40 text-main-400 border-b border-accent-100 w-full hover:cursor-pointer"
      trailing-icon="custom:chevron"
      :ui="{
        base: 'rounded-none bg-transparent h-8.5 pl-0 ',
        placeholder: 'w-fit text-main-400 ',
        content: 'rounded-none bg-white ring-0',
        item: 'text-main-400 hover:bg-main-400 hover:text-white before:rounded-none',
        trailing: 'pr-0',
        trailingIcon:
          'group-data-[state=open]:rotate-180 transition-transform duration-200 text-main-400 w-3 h-2.5',
      }"
      variant="none"
      placeholder="Категорії"
      multiple
      value-key="value"
      v-model="pagination.category"
    >
    </USelect>
    <div class="flex justify-center gap-2.5 lg:gap-7.5 w-full lg:w-fit">
      <USelect
        class="lg:w-40 text-main-400 border-b border-accent-100 max-w-1/2 grow hover:cursor-pointer"
        trailing-icon="custom:chevron"
        :ui="{
          base: 'rounded-none bg-transparent h-8.5 pl-0 ',
          placeholder: 'w-fit text-main-400',
          content: 'rounded-none bg-white ring-0',
          item: 'text-main-400 hover:bg-main-400 hover:text-white before:rounded-none',
          trailing: 'pr-0',
          trailingIcon:
            'group-data-[state=open]:rotate-180 transition-transform duration-200 text-main-400 w-3 h-2.5',
        }"
        variant="none"
        placeholder="Сортувати за"
        :items="sortFieldItems"
        v-model="pagination.sortBy"
        @change="onSortByChange"
      />
      <USelect
        class="lg:w-40 text-main-400 border-b border-accent-100 max-w-1/2 grow hover:cursor-pointer"
        trailing-icon="custom:chevron"
        :ui="{
          base: 'rounded-none bg-transparent h-8.5 pl-0 ',
          placeholder: 'w-fit text-main-400',
          content: 'rounded-none bg-white ring-0',
          item: 'text-main-400 hover:bg-main-400 hover:text-white before:rounded-none',
          trailing: 'pr-0',
          trailingIcon:
            'group-data-[state=open]:rotate-180 transition-transform duration-200 text-main-400 w-3 h-2.5',
        }"
        variant="none"
        placeholder="Порядок"
        :disabled="!pagination.sortBy"
        :items="sortOrderItems[pagination.sortBy as keyof typeof sortOrderItems]"
        v-model="pagination.sortOrder"
      />
    </div>
    <div div class="flex justify-center gap-2.5 lg:gap-7.5 w-full lg:w-fit">
      <UInput
        class="lg:w-40 text-main-400 border-b border-accent-100 no-spinner max-w-1/2 grow"
        :ui="{
          base: 'rounded-none bg-transparent h-8.5 text-main-400 pl-0',
        }"
        variant="none"
        placeholder="Ціна від"
        v-model="priceMin"
        @beforeinput="formatToFloat"
      />
      <UInput
        class="lg:w-40 text-main-400 border-b border-accent-100 no-spinner max-w-1/2 grow"
        :ui="{
          base: 'rounded-none bg-transparent h-8.5 text-main-400 pl-0',
        }"
        type="text"
        variant="none"
        placeholder="Ціна до"
        v-model="priceMax"
        @beforeinput="formatToFloat"
      />
    </div>
  </div>
</template>

<style>
.no-spinner input::-webkit-inner-spin-button,
.no-spinner input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
