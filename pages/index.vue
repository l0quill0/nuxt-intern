<script setup lang="ts">
import { getPaginatedCategories } from "~/api/categoryApi";
import { PublicRoutes } from "~/enums/routes.enum";

const { pagination } = useItemPagination();

const { data: categories } = await getPaginatedCategories();

const onCategoryClick = (category: string) => {
  pagination.value.category = [category];
  navigateTo(PublicRoutes.CATALOG);
};
</script>

<template>
  <h2 class="text-3xl font-bold pt-12">До каталогу!</h2>
  <div
    class="flex flex-col lg:flex-row flex-wrap gap-[30px] max-w-[1110px] pt-[55px] lg:justify-evenly xl:justify-normal"
  >
    <CategoryCard
      v-if="categories?.data"
      v-for="category in categories.data"
      :category="category"
      @click="onCategoryClick"
    />
  </div>
</template>
