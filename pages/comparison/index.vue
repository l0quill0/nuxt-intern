<script setup lang="ts">
import { useCompStore } from "~/stores/comparisonStore";

const compStore = useCompStore();
</script>

<template>
  <div class="flex flex-col xl:w-full xl:max-w-277.5 w-11/12">
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
</template>
