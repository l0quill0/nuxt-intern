import { PublicRoutes } from "~/enums/routes.enum";

export default defineNuxtPlugin((nuxtApp) => {
  const token = useTokenStore();
  const user = useUserStore();
  const config = useRuntimeConfig();
  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest: ({ options }) => {
      if (token) {
        options.headers = new Headers(options.headers || {});
        options.headers.set("Authorization", `Bearer ${token.getToken()}`);
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        token.clearToken();
        user.clearUser();
        await nuxtApp.runWithContext(() => navigateTo(PublicRoutes.LOGIN));
      } else throw response._data.message;
    },
  });

  return {
    provide: {
      api,
    },
  };
});
