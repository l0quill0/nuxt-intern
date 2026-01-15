import { defineStore } from "pinia";

export const useCompStore = defineStore("compStore", {
  state: () => ({
    compIds: [] as {
      category: string;
      categoryName: string;
      items: number[];
    }[],
  }),
  persist: true,
  actions: {
    addItem(category: string, categoryName: string, id: number) {
      const categ = this.compIds.find((el) => el.category === category);
      if (categ) {
        categ.items.push(id);
      } else {
        this.compIds.push({ category, categoryName, items: [id] });
      }
    },
    removeItem(id: number, category: string) {
      const categ = this.compIds.find((el) => el.category === category);
      if (categ) {
        if (categ.items.length === 1) {
          this.compIds = this.compIds.filter((el) => el.category !== category);
        } else {
          categ.items = categ.items.filter((el) => el !== id);
        }
      }
    },
    clearCategory(category: string) {
      this.compIds = this.compIds.filter((el) => el.category !== category);
    },
    clearAll() {
      this.compIds = [];
    },
  },
  getters: {
    count: (state) =>
      state.compIds.reduce((acc, el) => {
        return (acc += el.items.length);
      }, 0),
    countByCategory: (state) => {
      return (category: string) => {
        const cat = state.compIds.find((el) => el.category === category);
        return cat?.items.length ?? 0;
      };
    },
    allList: (state) => state.compIds,
    list: (state) => {
      return (category: string) => {
        const res = state.compIds.find((el) => el.category === category);
        return res;
      };
    },
    isInStore: (state) => {
      return (id: number) =>
        state.compIds.find((el) => el.items.find((el) => el === id));
    },
  },
});
