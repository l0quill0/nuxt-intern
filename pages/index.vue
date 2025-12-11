<script setup lang="ts">
import { getCategories } from "~/api/categoryApi";

const { data: categories } = await getCategories();
const { pagination } = useItemPagination();

const onCategoryClick = (category: string) => {
  pagination.value.category = [category];
  navigateTo("/catalog");
};
</script>

<template>
  <div class="flex flex-wrap gap-[30px] max-w-[1110px] pt-[55px]">
    <CategoryCard
      v-if="categories"
      v-for="category in categories"
      :category="category"
      @click="onCategoryClick"
    />
  </div>
</template>
