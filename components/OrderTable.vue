<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import dayjs from "dayjs";
import { cancelOrder, confirmOrder, getOrders } from "~/api/orderApi";
import type { IItem } from "~/Types/item.type";
import { OrderStatus } from "~/Types/order.status.enum";

const UButton = resolveComponent("UButton");
const config = useRuntimeConfig();

const { pagination } = useOrderPagination();
const user = useUserStore().getUser();

const toast = useToast();

const { data: orders, refresh } = await getOrders(pagination);

const sortField = ref<string>("id");
const sortAsc = ref(true);

type tableRow = {
  id: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: (IItem & { quantity: number })[];
};

type itemTableRow = IItem & { quantity: number };

const onItemClick = (itemId: number) => {
  navigateTo(`/item/${itemId}`);
};

const onPageChange = (page: number) => {
  if (orders.value) {
    if (page < 1 || page > orders.value?.meta.totalPages) return;
  }

  pagination.value.page = page;
};

const onSortClick = (sortBy: string) => {
  sortBy !== sortField.value
    ? (sortAsc.value = true)
    : (sortAsc.value = !sortAsc.value);

  pagination.value.sortBy = sortBy;
  pagination.value.sortOrder = sortAsc.value ? "asc" : "desc";
  sortField.value = sortBy;
};

const onCancelClick = async (id: number) => {
  try {
    await cancelOrder(id);
    refresh();
    toast.add({ title: `Замовлення №${id} скасовано`, color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
};

const onConfirmClick = async (id: number) => {
  try {
    await confirmOrder(id);
    refresh();
    toast.add({ title: `Замовлення №${id} підтвержено`, color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
};

const tableColumns: TableColumn<tableRow>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      return h(UButton, {
        icon: "i-lucide-chevron-down",
        variant: "ghost",
        square: true,
        class: "rounded-none hover:bg-transparent active:bg-transparent",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
            "text-[#333333]",
          ],
        },
        onClick: () => row.toggleExpanded(),
      });
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return h(UButton, {
        icon:
          sortField.value === column.id
            ? sortAsc.value
              ? "i-lucide-arrow-up-narrow-wide"
              : "i-lucide-arrow-down-wide-narrow"
            : "i-lucide-arrow-up-down",
        class:
          "rounded-none bg-transparent hover:bg-transparent active:bg-transparent font-bold p-0 hover:text-gray-500 duration-300",
        onClick: () => onSortClick(column.id),
        label: "№",
      });
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return h(UButton, {
        icon:
          sortField.value === column.id
            ? sortAsc.value
              ? "i-lucide-arrow-up-narrow-wide"
              : "i-lucide-arrow-down-wide-narrow"
            : "i-lucide-arrow-up-down",
        class:
          "rounded-none bg-transparent hover:bg-transparent active:bg-transparent font-bold p-0 hover:text-gray-500 duration-300",
        onClick: () => onSortClick(column.id),
        label: "Статус",
      });
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return h(UButton, {
        icon:
          sortField.value === column.id
            ? sortAsc.value
              ? "i-lucide-arrow-up-narrow-wide"
              : "i-lucide-arrow-down-wide-narrow"
            : "i-lucide-arrow-up-down",
        class:
          "rounded-none bg-transparent hover:bg-transparent active:bg-transparent font-bold p-0 hover:text-gray-500 duration-300",
        onClick: () => onSortClick(column.id),
        label: "Сума",
      });
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return h(UButton, {
        icon:
          sortField.value === column.id
            ? sortAsc.value
              ? "i-lucide-arrow-up-narrow-wide"
              : "i-lucide-arrow-down-wide-narrow"
            : "i-lucide-arrow-up-down",
        class:
          "rounded-none bg-transparent hover:bg-transparent active:bg-transparent font-bold p-0 hover:text-gray-500 duration-300",
        onClick: () => onSortClick(column.id),
        label: "Створено",
      });
    },
  },
  {
    id: "actions",
    header: "Дії",
    cell: ({ row }) => {
      const buttons = [];
      if (row.original.status == OrderStatus.PENDING) {
        if (user?.role === "ADMIN")
          buttons.push(
            h(UButton, {
              color: "success",
              label: "Підтвердити",
              class: "rounded-none",
              onClick: () => onConfirmClick(row.original.id),
            })
          );
        buttons.push(
          h(UButton, {
            color: "error",
            label: "Скасувати",
            class: "rounded-none",
            onClick: () => onCancelClick(row.original.id),
          })
        );
      }

      return h("div", { class: "flex gap-[10px]" }, buttons);
    },
  },
];

const orderItemColumns: TableColumn<itemTableRow>[] = [
  {
    accessorKey: "title",
    header: "Назва",
  },
  {
    accessorKey: "image",
    header: "",
  },
  {
    accessorKey: "price",
    header: "Ціна",
  },
  {
    accessorKey: "quantity",
    header: "Кількість",
  },
];

const parsedData = ref<tableRow[]>([]);

watch(
  orders,
  (newData) => {
    if (newData) {
      parsedData.value = newData.data.map((order) => ({
        ...order,
        status: OrderStatus[order.status as keyof typeof OrderStatus],
        createdAt: dayjs(order.createdAt).format("DD.MM.YYYY"),
      }));
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col items-center w-[900px] grow">
    <UTable
      :data="parsedData"
      :columns="tableColumns"
      :ui="{
        th: 'pl-0 text-[#333333] ',
        td: 'text-[#333333] ',
      }"
      class="w-full grow"
      empty="Замовлень не знайдено"
    >
      <template #expanded="{ row }">
        <UTable
          :data="row.original.items"
          :columns="orderItemColumns"
          :ui="{
            td: 'break-all whitespace-normal text-[#333333]',
            th: 'bg-[#333333] text-white font-bold',
            tbody:
              '[&>tr]:data-[selectable=true]:hover:bg-stone-300 [&>tr]:data-[selectable=true]:duration-300',
          }"
          @select="(e, row) => onItemClick(row.original.id)"
          empty="Товарів не знайдено"
        >
          <template #image-cell="{ row }">
            <NuxtImg
              :src="`${config.public.bucketUrl}${row.original.image}`"
              class="w-[75px] h-[75px]"
              :placeholder="'/no-image.png'"
            />
          </template>
          <template #price-cell="{ row }">
            <span>{{ row.original.price.toFixed(2) }}</span>
          </template>
        </UTable>
      </template>
      <template #id-cell="{ row }">
        <span>{{ `№${row.original.id}` }}</span>
      </template>
      <template #status-cell="{ row }">
        <span
          :class="
            row.original.status === OrderStatus['PENDING']
              ? 'text-orange-400'
              : row.original.status === OrderStatus['CANCELED']
              ? 'text-red-600'
              : 'text-green-500'
          "
          >{{ row.original.status }}</span
        >
      </template>
      <template #total-cell="{ row }">
        <span>{{ `${row.original.total.toFixed(2)} ₴` }}</span>
      </template>
      <template #createdAt-cell="{ row }">
        <span>{{ row.original.createdAt }}</span>
      </template>
    </UTable>
    <UPagination
      v-model:page="pagination.page"
      :items-per-page="pagination.pageSize"
      :total="orders?.meta.totalItems"
      @update:page="onPageChange"
      class="pt-2.5 pb-2.5"
      :ui="{
        item: 'rounded-none bg-transparent active:bg-transparent hover:text-white  hover:bg-[#333333] text-[#333333] ring-0',
        first: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        last: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        next: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
        prev: 'rounded-none bg-[#333333] disabled:bg-gray-500 ring-0',
      }"
    />
  </div>
</template>
