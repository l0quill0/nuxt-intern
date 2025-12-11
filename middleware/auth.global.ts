export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const tokenStore = useTokenStore();

  const publicRoutes = ["/", "/login", "/register", "/catalog"];
  const publicDynamicRoutes = ["/item/"];
  const protectedUserRoutes = ["/favourite, /profile"];
  const protectedAdminRoutes = ["/items-admin", "/orders-admin"];

  if (
    protectedAdminRoutes.includes(to.path) &&
    (userStore.getUser()?.role !== "ADMIN" || !tokenStore.getToken())
  ) {
    return navigateTo("/");
  }

  if (
    protectedUserRoutes.includes(to.path) &&
    (!userStore.getUser() || !tokenStore.getToken())
  ) {
    return navigateTo("/");
  }

  if (
    (!userStore.getUser() || !tokenStore.getToken()) &&
    !publicRoutes.includes(to.path) &&
    !publicDynamicRoutes.some((route) => to.path.startsWith(route))
  ) {
    return navigateTo("/");
  }
});
