export default defineNuxtPlugin(async () => {
  const tokenStore = useTokenStore();
  const userStore = useUserStore();

  tokenStore.loadToken();

  if (tokenStore.getToken()) {
    try {
      await userStore.fetchUser();
    } catch (e) {
      tokenStore.clearToken();
      userStore.clearUser();
    }
  }
});
