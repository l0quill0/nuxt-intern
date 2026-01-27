import { Cookie } from "~/enums/cookie.enum";

export const useTokenStore = defineStore("userToken", {
  state: () => ({
    userToken: null as string | null,
  }),
  actions: {
    loadToken() {
      const token = useCookie(Cookie.TOKEN);
      this.userToken = token.value || null;
    },
    getToken() {
      return this.userToken;
    },
    setToken(token: string) {
      const cookie = useCookie(Cookie.TOKEN);
      cookie.value = token;
      this.userToken = token;
    },
    clearToken() {
      const cookie = useCookie(Cookie.TOKEN);
      cookie.value = null;
      this.userToken = null;
    },
  },
  getters: {
    isAuth: (state) => {
      return !!state.userToken;
    },
  },
});
