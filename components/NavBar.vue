<script setup lang="ts">
import { ShoppingCart } from "lucide-vue-next";
import { PublicRoutes, UserRoutes } from "~/enums/routes.enum";
import Cart from "./Cart.vue";

const overlay = useOverlay();
const modal = overlay.create(Cart);

const { currentMenu } = useMenus();
const { pagination } = useItemPagination();

const tokenStore = useTokenStore();
const userStore = useUserStore();

const { userToken } = storeToRefs(tokenStore);
const { user } = storeToRefs(userStore);

const route = useRoute();

const search = ref(pagination.value.search);
const searchDebounced = debouncedRef(search, 500);

const isMenuActive = computed(() => user && userToken);

const menuOpen = ref(false);

function openCart() {
  modal.open();
}

watch(searchDebounced, (value) => {
  pagination.value.search = value;
});
</script>

<template>
  <div
    class="w-full min-h-[110px] xl:pl-56 xl:pr-56 mx-auto flex items-center justify-between p-5 bg-main-400 sticky top-0 z-10"
  >
    <NuxtLink
      :to="PublicRoutes.HOME"
      @click="() => (menuOpen = false)"
      class="text-white text-4xl font-bold"
      >Logo</NuxtLink
    >
    <div class="flex gap-5 xl:gap-10 justify-center items-center">
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
        variant="link"
        class="p-0 w-6 h-6 flex justify-center group"
        @click="openCart"
        v-if="user && userToken"
      >
        <ShoppingCart
          class="text-white group-hover:text-main-300 w-4 h-4 duration-300"
          fill="currentColor"
          stroke="none"
        />
      </UButton>
      <UButton
        variant="link"
        class="p-0 w-6 h-6 justify-center group xl:hidden"
        @click="
          () => {
            menuOpen = !menuOpen;
          }
        "
        v-if="
          route.path !== PublicRoutes.LOGIN &&
          route.path !== PublicRoutes.REGISTER
        "
      >
        <UIcon name="custom:burger" />
      </UButton>
      <div class="menu" :class="menuOpen ? 'open' : ''">
        <NuxtLink
          v-if="
            (!user || !userToken) &&
            route.path !== PublicRoutes.LOGIN &&
            route.path !== PublicRoutes.REGISTER
          "
          :to="PublicRoutes.LOGIN"
          @click="() => (menuOpen = false)"
          class="hover:underline hover:text-main-300 text-white p-0 h-[21px] text-sm duration-300"
        >
          Вхід/Регистрація
        </NuxtLink>
        <UDropdownMenu
          class=""
          :items="currentMenu"
          :ui="{
            content: 'rounded-none bg-main-400 ring-accent-100',
            item: 'bg-main-400 rounded-none hover:rounded-none before:rounded-none hover:bg-accent-100 group hover:cursor-pointer',
            itemLabel: 'group-hover:text-main-400',
            itemLeadingIcon: 'text-white! group-hover:text-main-400!',
            group: 'p-0',
          }"
          v-if="user && userToken"
        >
          <UButton
            variant="link"
            class="p-0 w-6 h-6 hidden xl:flex justify-center group"
            :disabled="!isMenuActive"
          >
            <UIcon
              name="custom:user"
              class="w-4 h-4 text-white group-hover:text-main-300 duration-300"
            />
          </UButton>
        </UDropdownMenu>
        <NuxtLink
          v-for="item in currentMenu"
          @click="
            () => {
              menuOpen = false;
              item.onSelect();
            }
          "
          class="text-white text-[21px] xl:hidden"
          >{{ item.label }}</NuxtLink
        >
        <div
          class="bg-accent-50 w-full h-px border-b-accent-50 xl:hidden"
        ></div>
        <NuxtLink
          class="p-0 xl:w-6 xl:h-6 w-[50px] h-[50px] flex justify-center items-center group"
          :to="UserRoutes.FAVOURITE"
          @click="() => (menuOpen = false)"
          v-if="user && userToken"
        >
          <UIcon
            name="custom:heart"
            class="xl:w-4 xl:h-4 w-[50px] h-[50px] text-white group-hover:text-main-300 duration-300"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="css">
body.menu.open {
  overflow-y: hidden;
}

.menu {
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: var(--color-main-400);
  width: 100%;
  height: 100vh;
  left: 100%;
  top: 110px;
  gap: 30px;
  padding: 60px 35px 0px 35px;
  transition: transform 300ms ease-in-out;
}

.menu.open {
  transform: translate(-100%);
}

@media (min-width: 1024px) {
  .menu {
    width: 50%;
  }
}

@media (min-width: 1280px) {
  .menu {
    position: relative;
    flex-direction: row;
    padding: 0;
    transform: translate(0);
    transition: none;
    height: fit-content;
    width: fit-content;
    top: 0;
    left: 0;
  }
}
</style>
