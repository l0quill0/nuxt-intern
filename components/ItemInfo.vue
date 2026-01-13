<script setup lang="ts">
import { addFavourites, removeFavourites } from "~/api/userApi";
import { addToCart } from "~/api/cartApi";
import type { IItem } from "~/types/item.types";

const props = defineProps<{
  itemInfo: IItem & { isInFavourite: boolean };
}>();

const emit = defineEmits<{
  (e: "updateInfo"): void;
}>();

const config = useRuntimeConfig();
const toast = useToast();

const user = useUserStore().getUser();
const token = useTokenStore().getToken();

const imageLink = `${config.public.bucketUrl}${props.itemInfo.image}`;

async function onFavouriteAddClick() {
  try {
    await addFavourites(props.itemInfo.id);
    await refreshNuxtData("count");
    emit("updateInfo");
    toast.add({ title: "Додано до улюбленого", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}
async function onFavouriteRemoveClick() {
  try {
    await removeFavourites(props.itemInfo.id);
    await refreshNuxtData("count");
    emit("updateInfo");
    toast.add({ title: "Видалено з улюбленого", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

async function addToCartClick() {
  try {
    await addToCart(props.itemInfo.id);
    await refreshNuxtData("count");
    toast.add({ title: "Додано до кошика", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}
</script>

<template>
  <div
    class="flex justify-center items-center gap-7.5 flex-col lg:flex-row w-full lg:px-2.5 xl:p-0"
  >
    <NuxtImg
      :key="props.itemInfo.id"
      :src="imageLink"
      class="lg:w-135 lg:h-145 w-full object-cover"
      :placeholder="'/no-image.png'"
    />
    <div
      class="lg:w-135 lg:h-145 lg:flex-row w-full flex flex-col border border-accent-100 p-2.5"
    >
      <div
        class="w-full h-full border border-accent-100 flex flex-col px-7.5 pt-10 pb-10 gap-7.5"
      >
        <h3 class="text-2xl tracking-widest">
          {{ props.itemInfo.title }}
        </h3>

        <span class="text-accent-300 text-[14px] leading-[150%]">{{
          `Категорія: ${props.itemInfo.category?.name}`
        }}</span>
        <div class="flex gap-2 items-start">
          <p>{{ Number(props.itemInfo.score?.avg).toFixed(1) }}</p>
          <NuxtRating :rating-value="Number(props.itemInfo.score?.avg)" />
          <p>{{ `(${props.itemInfo.score?.count})` }}</p>
        </div>
        <div class="w-full h-px bg-accent-100"></div>
        <span class="h-full text-[14px] leading-[150%] wrap-break-word">{{
          props.itemInfo.description
        }}</span>
        <span class="text-[24px] tracking-wider uppercase font-semibold">{{
          `${props.itemInfo.price?.toFixed(2)} ₴`
        }}</span>
        <div
          class="flex items-start gap-3.75 lg:items-center lg:gap-7.5 flex-col lg:flex-row"
          v-if="!props.itemInfo.isRemoved"
        >
          <UButton
            v-if="user && token"
            color="main"
            class="border border-white pt-2.5 pb-2.5 pl-5 pr-5 text-white text-[18px]"
            @click="addToCartClick"
            >Додати у кошик</UButton
          >
          <UButton
            variant="outline"
            color="main"
            class="pt-2.5 pb-2.5 pl-5 pr-5 text-[18px]"
            v-if="user && token && !props.itemInfo.isInFavourite"
            @click="onFavouriteAddClick"
            >Додати у улюблене</UButton
          >
          <UButton
            variant="outline"
            color="main"
            class="pt-2.5 pb-2.5 pl-5 pr-5 text-[18px]"
            v-if="user && token && props.itemInfo.isInFavourite"
            @click="onFavouriteRemoveClick"
            >Прибрати з улюбленого</UButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
