<script setup lang="ts">
import { addFavourites, removeFavourites } from "~/api/userApi";
import type { IProductWithScore } from "~/types/product.types";
import { Scale, Check, Heart, HeartCrack } from "lucide-vue-next";

const props = defineProps<{
  itemInfo: IProductWithScore & { isInFavourites: boolean };
}>();

const emit = defineEmits<{
  (e: "updateInfo"): void;
}>();

const config = useRuntimeConfig();
const toast = useToast();
const compStore = useCompStore();
const cartStore = useCartStore();
const { isAuth } = storeToRefs(useTokenStore());

const isComp = computed(() => compStore.isInStore(props.itemInfo.id));

const imageLink = `${config.public.bucketUrl}${props.itemInfo.image}`;

async function onFavClick() {
  try {
    props.itemInfo.isInFavourites
      ? await removeFavourites(props.itemInfo.id)
      : await addFavourites(props.itemInfo.id);
    await refreshNuxtData("count");
    emit("updateInfo");
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
  }
}

async function addToCartClick() {
  try {
    await cartStore.updateItems({ productId: props.itemInfo.id, quantity: 1 });
    if (isAuth.value) {
      await refreshNuxtData("count");
    }
    toast.add({ title: "Додано до кошика", color: "success" });
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
  }
}

function onCompClick() {
  if (isComp.value) {
    compStore.removeItem(props.itemInfo.id, props.itemInfo.category.slug);
  } else {
    compStore.addItem(
      props.itemInfo.category.slug,
      props.itemInfo.category.name,
      props.itemInfo.id,
    );
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
          class="flex items-start gap-3.75 lg:items-center lg:gap-7.5 flex-row justify-between w-full"
          v-if="!props.itemInfo.isRemoved"
        >
          <UButton
            color="main"
            class="border border-white py-2.5 px-5 text-white text-[18px]"
            @click="addToCartClick"
            >Додати у кошик</UButton
          >
          <div class="flex flex-row gap-2 h-full ml-auto">
            <UButton
              variant="ghost"
              color="main"
              class="relative hover:bg-transparent active:bg-transparent hover:text-main-300 duration-300 h-full"
              v-if="isAuth"
              @click="onFavClick"
              ><Heart
                v-if="!itemInfo.isInFavourites"
                class="w-8 h-8" /><HeartCrack v-else class="w-8 h-8"
            /></UButton>
            <UButton
              variant="ghost"
              color="main"
              class="relative hover:bg-transparent active:bg-transparent hover:text-main-300 duration-300 h-full"
              @click="onCompClick"
              ><Scale class="w-8 h-8" /><Check
                class="absolute bottom-0 right-0 h-6 w-6"
                v-if="isComp"
            /></UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
