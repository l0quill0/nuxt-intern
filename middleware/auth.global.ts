import { includes, values } from "lodash";
import { AdminRoutes, PublicRoutes, UserRoutes } from "~/enums/routes.enum";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const tokenStore = useTokenStore();

  const userRoutes = values(UserRoutes) as string[];
  const adminRoutes = values(AdminRoutes) as string[];

  if (
    includes(adminRoutes, to.path) &&
    (userStore.getUser()?.role !== "ADMIN" || !tokenStore.getToken())
  ) {
    return navigateTo(PublicRoutes.HOME);
  }

  if (
    includes(userRoutes, to.path) &&
    (!userStore.getUser() || !tokenStore.getToken())
  ) {
    return navigateTo(PublicRoutes.HOME);
  }

  if (
    (to.path === PublicRoutes.LOGIN || to.path === PublicRoutes.REGISTER) &&
    userStore.getUser() &&
    tokenStore.getToken()
  ) {
    return navigateTo(PublicRoutes.HOME);
  }
});
