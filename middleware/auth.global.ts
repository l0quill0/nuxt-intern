import { AdminRoutes, PublicRoutes, UserRoutes } from "~/enums/routes.enum";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const tokenStore = useTokenStore();

  if (
    to.path in AdminRoutes &&
    (userStore.getUser()?.role !== "ADMIN" || !tokenStore.getToken())
  ) {
    return navigateTo(PublicRoutes.HOME);
  }

  if (
    to.path in UserRoutes &&
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
