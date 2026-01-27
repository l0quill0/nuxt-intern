import { createUnauth, getActive, updateOrder } from "~/api/orderApi";
import { useTokenStore } from "./tokenStore";
import type { IOrderProduct } from "~/types/order.types";
import type { IProduct } from "~/types/product.types";
import { OrderStatus } from "~/enums/order.status.enum";

interface ISendOrder {
  postId: number;
  email?: string;
}

export const useCartStore = defineStore("cartStore", {
  persist: true,
  state: () => ({
    items: [] as IOrderProduct[],
    total: 0,
  }),

  actions: {
    async fetchItems(data?: { productId: number; quantity: number }[]) {
      const token = useTokenStore().getToken();
      if (token) {
        const order = await getActive();
        if (!order) return;
        this.items = order.items;
        this.total = order.total;
      } else if (data) {
        const res = await Promise.all(
          data.map((item) =>
            useNuxtApp().$api<IProduct>(`/product/${item.productId}`, {
              method: "GET",
            }),
          ),
        );
        const itemMap = new Map(res.map((item) => [item.id, item]));

        this.items = data.map((item) => ({
          product: itemMap.get(item.productId)!,
          quantity: item.quantity,
        }));
        this.total = this.items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        );
      }
    },

    async updateItems({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) {
      const token = useTokenStore().getToken();
      let hasItem = false;

      const newItems = this.items
        .map((item) => {
          if (item.product.id === productId) {
            hasItem = true;
            if (item.quantity + quantity > 0) {
              return {
                productId,
                quantity: item.quantity + quantity,
              };
            }
          } else {
            return {
              productId: item.product.id,
              quantity: item.quantity,
            };
          }
        })
        .filter((item) => item !== undefined);
      if (!hasItem) newItems.push({ productId, quantity });

      if (token) {
        const order = await getActive();
        if (!order) return;
        await updateOrder(order.id, { items: newItems });
        await this.fetchItems();
      } else {
        await this.fetchItems(newItems);
      }
    },

    async clear() {
      const token = useTokenStore().getToken();
      if (token) {
        const order = await getActive();
        if (!order) return;
        await updateOrder(order.id, { items: [] });
      }
      this.items = [];
      this.total = 0;
    },
    clearStore() {
      this.items = [];
      this.total = 0;
    },

    async sendOrder(data: ISendOrder) {
      const token = useTokenStore().getToken();
      if (token) {
        const order = await getActive();
        if (!order) return;
        await updateOrder(order.id, {
          status: OrderStatus.PENDING,
          postId: data.postId,
        });
      } else if (data.email) {
        const sendItems = this.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
        await createUnauth({
          email: data.email!,
          postId: data.postId,
          items: sendItems,
        });
      }
      this.items = [];
      this.total = 0;
    },
  },

  getters: {
    cart: (state) => {
      return {
        items: state.items,
        total: state.total,
      };
    },
    cartCount: (state) => {
      return state.items.length;
    },
  },
});
