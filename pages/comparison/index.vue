<script setup lang="ts">
import { PublicRoutes } from "~/enums/routes.enum";
import { useCompStore } from "~/stores/comparisonStore";

const compStore = useCompStore();
</script>

<template>
  <div
    class="flex flex-col xl:w-full xl:max-w-277.5 w-11/12"
    v-if="compStore.allList.length > 0"
  >
    <template
      v-for="(category, index) in compStore.allList"
      :key="category.category"
    >
      <ComparisonPreview :data="category" />
      <div
        v-if="index < compStore.allList.length - 1"
        class="bg-accent-100 w-full h-px my-2.5"
      ></div>
    </template>
  </div>
  <div v-else class="flex flex-col items-center text-2xl font-semibold pt-15">
    <p>Немає товарів для порівняння</p>
    <NuxtLink
      :to="PublicRoutes.CATALOG"
      class="border-b-2 border-b-transparent hover:border-b-main-400 duration-300"
      >До каталогу</NuxtLink
    >
  </div>
</template>
