<script setup lang="ts">
import { getFavourites } from "~/api/userApi";
import { PublicDynamicRoutes, PublicRoutes } from "~/enums/routes.enum";

const { data } = await getFavourites();

function onItemClick(id: number) {
  navigateTo(`${PublicDynamicRoutes.ITEM}${id}`);
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <h2 class="text-3xl font-bold pt-12" v-if="data?.items.length">Улюблене</h2>
    <div
      class="max-w-[1110px] w-full flex flex-col items-center pt-2.5 lg:pt-[30px] gap-2.5 lg:gap-[50px]"
    >
      <div class="flex flex-col items-center">
        <h1
          v-if="!data?.items.length"
          class="text-3xl font-semibold text-wrap text-center"
        >
          Ви ще нічого не додали до улюбленого
        </h1>
        <NuxtLink
          v-if="!data?.items.length"
          class="mt-5 text-2xl hover:text-main-300 border-b-2 border-transparent hover:border-main-300"
          :to="PublicRoutes.CATALOG"
          >До каталогу</NuxtLink
        >
      </div>
      <NuxtImg
        src="../public/broken-heart-icon.png"
        v-if="!data?.items.length"
      />
      <div
        v-if="data?.items"
        class="xl:gap-x-[30px] pt-[60px] pb-[60px] max-w-[1110px] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:gap-x-[15px]"
      >
        <template v-for="(item, index) in data.items" :key="item.id">
          <ItemCard :item-info="item" @click="onItemClick" />
          <div
            v-if="index + 1 !== data.items.length"
            class="w-full h-px bg-accent-100 lg:hidden"
          ></div>
          <div
            v-if="(index + 1) % 2 === 0 && index + 1 !== data.items.length"
            class="w-full h-px bg-accent-100 my-[15px] hidden lg:block xl:hidden col-span-full"
          ></div>
          <div
            v-if="(index + 1) % 3 === 0 && index + 1 !== data.items.length"
            class="w-full h-px bg-accent-100 my-[30px] hidden xl:block col-span-full"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>
