<script setup lang="ts">
import { getFavourites } from "~/api/userApi";

const { data, pending } = await getFavourites();
function onItemClick(id: number) {
  navigateTo(`/item/${id}`);
}
</script>

<template>
  <div class="w-screen flex flex-col items-center">
    <h2
      class="text-3xl font-bold text-[#333333] pt-12"
      v-if="data?.items.length"
    >
      Улюблене
    </h2>
    <div
      class="max-w-[1110px] w-max flex flex-col items-center pt-[30px] gap-[50px]"
    >
      <NuxtLoadingIndicator v-if="pending" />
      <div class="flex flex-col items-center">
        <h1
          v-if="!data?.items.length"
          class="text-3xl font-semibold text-[#333333]"
        >
          Ви ще нічого не додали до улюбленого
        </h1>
        <NuxtLink
          v-if="!data?.items.length"
          class="mt-5 text-2xl text-[#333333] hover:text-gray-500 border-b-2 border-transparent hover:border-gray-500"
          to="/catalog"
          >До каталогу</NuxtLink
        >
      </div>
      <NuxtImg
        src="../public/broken-heart-icon.png"
        v-if="!data?.items.length"
      />
      <div
        v-if="data?.items"
        class="flex gap-x-[30px] pt-[60px] pb-[60px] flex-wrap w-max-[1110px]"
      >
        <template v-for="(item, index) in data.items" :key="item.id">
          <ItemCard :item-info="item" @click="onItemClick" />
          <div
            v-if="(index + 1) % 3 === 0"
            class="w-full h-px bg-[#D6D6D6] my-[30px]"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>
