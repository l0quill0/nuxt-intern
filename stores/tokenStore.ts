import { defineStore } from "pinia";

export const useTokenStore = defineStore("userToken", {
  state: () => ({
    userToken: null as string | null,
  }),
  actions: {
    loadToken() {
      const token = useCookie("token");
      this.userToken = token.value || null;
    },
    getToken() {
      return this.userToken;
    },
    setToken(token: string) {
      const cookie = useCookie("token");
      cookie.value = token;
      this.userToken = token;
    },
    clearToken() {
      const cookie = useCookie("token");
      cookie.value = null;
      this.userToken = null;
    },
  },
});
