import { AdminRoutes, PublicRoutes, UserRoutes } from "~/enums/routes.enum";
import type { IUser } from "~/types/user.type";

export const useMenus = () => {
  const tokenStore = useTokenStore();
  const userStore = useUserStore();
  const { userToken } = storeToRefs(tokenStore);
  const { user } = storeToRefs(userStore);
  const toast = useToast();

  const menuUser = ref([
    {
      label: "Мій профіль",
      icon: "i-lucide-user",
      onSelect: () => navigateTo(UserRoutes.PROFILE),
    },
    {
      label: "Вийти",
      icon: "i-lucide-log-out",
      onSelect: () => {
        useTokenStore().clearToken();
        useUserStore().clearUser();
        navigateTo(PublicRoutes.HOME);
        toast.add({ title: "Вихід успішний", color: "success" });
      },
    },
  ]);

  const menuGuest = ref([]);

  const menuAdmin = ref([
    {
      label: "Товари",
      icon: "i-lucide-package",
      onSelect: () => {
        navigateTo(AdminRoutes.ITEMS);
      },
    },
    {
      label: "Замовлення",
      icon: "i-lucide-list",
      onSelect: () => {
        navigateTo(AdminRoutes.ORDERS);
      },
    },
    {
      label: "Категорії",
      icon: "i-lucide-tags",
      onSelect: () => {
        navigateTo(AdminRoutes.CATEGORIES);
      },
    },
    {
      label: "Вийти",
      icon: "i-lucide-log-out",
      onSelect: () => {
        useTokenStore().setToken("");
        useUserStore().setUser({} as IUser);
        navigateTo(PublicRoutes.HOME);
        toast.add({ title: "Вихід успішний", color: "success" });
      },
    },
  ]);

  const currentMenu = computed(() => {
    if (user.value) {
      if (userToken.value && user.value.role === "ADMIN")
        return menuAdmin.value;
      if (userToken.value && user.value.role === "USER") return menuUser.value;
    }
    return menuGuest.value;
  });

  return { currentMenu };
};
