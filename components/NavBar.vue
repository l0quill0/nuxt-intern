<script setup lang="ts">
import { ShoppingCart } from "lucide-vue-next";
import { PublicRoutes, UserRoutes } from "~/enums/routes.enum";
const { currentMenu } = useMenus();
const { pagination } = useItemPagination();

const tokenStore = useTokenStore();
const userStore = useUserStore();
const { userToken } = storeToRefs(tokenStore);
const { user } = storeToRefs(userStore);
const route = useRoute();
const search = ref(pagination.value.search);
const searchDebounced = debouncedRef(search, 2000);
const isMenuActive = computed(() => user && userToken);

function onLoginClick() {
  navigateTo(PublicRoutes.LOGIN);
}

function onFavouriteClick() {
  navigateTo(UserRoutes.FAVOURITE);
}

watch(searchDebounced, (value) => {
  pagination.value.search = value;
});
</script>

<template>
  <div
    class="w-full max-w-[1110px] h-[111px] max-h-[111px] mx-auto flex items-center justify-between"
  >
    <NuxtLink :to="PublicRoutes.HOME" class="text-white text-4xl font-bold"
      >Logo</NuxtLink
    >
    <div class="flex items-center justify-center gap-10">
      <UInput
        placeholder="Пошук"
        class="text-white w-[90px] p-0"
        icon="custom:search"
        variant="none"
        :ui="{
          base: 'placeholder-white! h-6 text-[14px]! duration-300',
          leadingIcon: 'text-white w-[18px] h-[18px] p-0',
        }"
        v-model="search"
        v-if="
          route.fullPath.startsWith('/catalog') ||
          route.fullPath.startsWith('/admin/items')
        "
      />
      <UButton
        v-if="
          (!user || !userToken) &&
          route.path !== PublicRoutes.LOGIN &&
          route.path !== PublicRoutes.REGISTER
        "
        class="bg-transparent hover:bg-transparent active:bg-transparent hover:underline hover:text-slate-500 text-white p-0 h-[21px] text-sm duration-300"
        @click="onLoginClick"
      >
        Вхід/Регистрація
      </UButton>
      <div class="flex justify-center gap-[25px]">
        <UModal
          title="cart"
          description="cart"
          :ui="{
            content:
              'bg-[#f0f0f0] rounded-none ring-[#333333] min-w-[500px]  max-w-[800px] h-[600px] w-full',
            overlay: 'bg-[#f0f0f0b2]',
          }"
        >
          <UButton
            class="bg-transparent hover:bg-transparent active:bg-transparent p-0 w-6 h-6 flex justify-center group"
            v-if="user && userToken"
          >
            <ShoppingCart
              class="text-white group-hover:text-slate-500 group-active:text-[#333333] w-4 h-4 duration-300"
              fill="currentColor"
              stroke="none"
            />
          </UButton>
          <template #content>
            <Cart />
          </template>
        </UModal>
        <UDropdownMenu
          :items="currentMenu"
          :ui="{
            content: 'rounded-none bg-[#333333] ring-gray-500',
            item: 'bg-[#333333] rounded-none hover:rounded-none before:rounded-none hover:bg-white group',
            itemLabel: 'group-hover:text-black',
            itemLeadingIcon: 'text-white! group-hover:text-black!',
            group: 'p-0',
          }"
          v-if="user && userToken"
        >
          <UButton
            color="neutral"
            variant="ghost"
            class="bg-transparent hover:bg-transparent active:bg-transparent p-0 w-6 h-6 flex justify-center group"
            :disabled="!isMenuActive"
          >
            <UIcon
              name="custom:user"
              class="w-4 h-4 text-white group-hover:text-slate-500 group-active:text-gray-800 duration-300"
            />
          </UButton>
        </UDropdownMenu>
        <UButton
          class="bg-transparent hover:bg-transparent active:bg-transparent p-0 w-6 h-6 flex justify-center group"
          @click="onFavouriteClick"
          v-if="user && userToken"
        >
          <UIcon
            name="custom:heart"
            class="w-4 h-4 text-white group-hover:text-slate-500 group-active:text-gray-800 duration-300"
          />
        </UButton>
      </div>
    </div>
  </div>
</template>
