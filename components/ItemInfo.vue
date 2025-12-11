<script setup lang="ts">
import { getItemById } from "~/api/itemApi";
import { addFavourites, removeFavourites } from "~/api/userApi";
import { addToCart } from "~/api/cartApi";
const props = defineProps({
  id: { type: Number, required: true },
});
const config = useRuntimeConfig();
const user = useUserStore().getUser();
const token = useTokenStore().getToken();

const toast = useToast();

const { data: value, refresh } = await getItemById(props.id);

const { title, description, image, price, categoryName, isInFavourite } =
  value.value || {};

const imageLink = `${config.public.bucketUrl}${image}`;

async function onFavouriteAddClick() {
  try {
    await addFavourites(props.id);
    refresh();
    toast.add({ title: "Додано до улюбленого", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}
async function onFavouriteRemoveClick() {
  try {
    await removeFavourites(props.id);
    refresh();
    toast.add({ title: "Видалено з улюбленого", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}

async function addToCartClick() {
  try {
    await addToCart(props.id);
    toast.add({ title: "Додано до кошика", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}
</script>

<template>
  <div class="flex justify-center items-center gap-[30px]">
    <NuxtImg :src="imageLink" class="w-[540px] h-[580px] object-cover" />
    <div
      class="w-[540px] h-[580px] flex flex-col border border-[#D6D6D6] p-2.5"
    >
      <div
        class="w-full h-full border border-[#D6D6D6] flex flex-col pl-[30px] pr-[30px] pt-10 pb-10 gap-[30px]"
      >
        <h3 class="text-2xl text-[#333333] tracking-widest">
          {{ title }}
        </h3>
        <span class="text-[#979797] text-[14px] leading-[150%]">{{
          `Категорія: ${categoryName}`
        }}</span>
        <div class="w-full h-px bg-[#D6D6D6]"></div>
        <span class="h-full text-[14px] leading-[150%] wrap-break-word">{{
          description
        }}</span>
        <span class="text-[24px] tracking-wider uppercase font-semibold">{{
          `${price?.toFixed(2)} ₴`
        }}</span>
        <div class="flex items-center gap-[30px]">
          <UButton
            class="rounded-none bg-[#333333] border border-white pt-2.5 pb-2.5 pl-5 pr-5 hover:bg-gray-500 active:bg-gray-600 text-white duration-300"
            @click="addToCartClick"
            >Додати у кошик</UButton
          >
          <UButton
            class="rounded-none bg-[#F9F9F9] border border-[#333333] pt-2.5 pb-2.5 pl-5 pr-5 hover:bg-slate-300 active:bg-gray-600 duration-300"
            v-if="user && token && !isInFavourite"
            @click="onFavouriteAddClick"
            >Додати у улюблене</UButton
          >
          <UButton
            class="rounded-none bg-[#F9F9F9] border border-[#333333] pt-2.5 pb-2.5 pl-5 pr-5 hover:bg-slate-300 active:bg-gray-600 duration-300"
            v-if="user && token && isInFavourite"
            @click="onFavouriteRemoveClick"
            >Прибрати з улюбленого</UButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
