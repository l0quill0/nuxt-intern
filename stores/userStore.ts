import type { IUser } from "~/types/user.type";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null as null | IUser,
  }),
  actions: {
    async fetchUser() {
      const token = useTokenStore().getToken();
      if (!token) return;

      const user = await $fetch<IUser>("http://localhost:3000/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.user = user;
    },

    getUser(): IUser | null {
      return this.user;
    },

    setUser(payload: IUser) {
      this.user = { ...payload };
    },

    clearUser() {
      this.user = null;
    },
  },
});
