<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import dayjs from "dayjs";
import { getOrders, updateOrder } from "~/api/orderApi";
import { PublicDynamicRoutes } from "~/enums/routes.enum";
import { OrderStatus } from "~/enums/order.status.enum";
import type { IOrder } from "~/types/order.types";

const UButton = resolveComponent("UButton");
const toast = useToast();

const { pagination } = useOrderPagination();

const { data: orders, refresh, pending } = getOrders(pagination);

const parsedData = computed<tableRow[]>(
  () =>
    orders.value?.items.map((order) => ({
      ...order,
      status: OrderStatus[order.status as keyof typeof OrderStatus],
      createdAt: dayjs(order.createdAt).format("DD.MM.YYYY"),
    })) ?? [],
);

const totalItems = computed(() =>
  orders.value?.totalPages && pagination.value.pageSize
    ? orders.value.totalPages * pagination.value.pageSize
    : 0,
);

const sortField = ref<string>("id");
const sortAsc = ref(true);

const user = useUserStore().getUser();

type tableRow = IOrder;

const onItemClick = (itemId: number) => {
  navigateTo(`${PublicDynamicRoutes.ITEM}${itemId}`);
};

const onPageChange = (page: number) => {
  if (orders.value) {
    if (page < 1 || page > orders.value?.totalPages) return;
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
    await updateOrder(id, { status: OrderStatus.CANCELED });
    await refresh();
    toast.add({ title: `Замовлення №${id} скасовано`, color: "success" });
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
  }
};

const onConfirmClick = async (id: number) => {
  try {
    await updateOrder(id, { status: OrderStatus.COMPLETE });
    await refresh();
    toast.add({ title: `Замовлення №${id} підтвержено`, color: "success" });
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
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
        class: "hover:bg-transparent active:bg-transparent",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
            "text-main-400",
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
          "bg-transparent hover:bg-transparent active:bg-transparent font-bold p-0 hover:text-accent-300 flex text-main-400",
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
          "bg-transparent hover:bg-transparent active:bg-transparent font-bold p-0 hover:text-accent-300 flex text-main-400",
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
          "bg-transparent hover:bg-transparent active:bg-transparent font-bold p-0 hover:text-accent-300 flex text-main-400",
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
          "bg-transparent hover:bg-transparent active:bg-transparent font-bold p-0 hover:text-main-300 flex pr-2 text-main-400",
        onClick: () => onSortClick(column.id),
        label: "Створено",
      });
    },
  },
  {
    accessorKey: "postOffice",
    header: "Відділення",
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
              class: "flex justify-center",
              onClick: () => onConfirmClick(row.original.id),
            }),
          );
        buttons.push(
          h(UButton, {
            color: "error",
            label: "Скасувати",
            class: "flex justify-center",
            onClick: () => onCancelClick(row.original.id),
          }),
        );
      }

      return h(
        "div",
        { class: "flex gap-[10px] lg:flex-row flex-col lg:justify-end" },
        buttons,
      );
    },
  },
];
</script>

<template>
  <div
    class="flex flex-col items-center lg:w-225 xl:w-full xl:min-w-2/3 grow w-full p-2.5"
  >
    <UTable
      :data="parsedData"
      :columns="tableColumns"
      :loading="pending"
      :ui="{
        th: 'pl-0 text-main-400 ',
        td: 'text-main-400 ',
      }"
      class="w-full grow"
      empty="Замовлень не знайдено"
    >
      <template #expanded="{ row }">
        <OrderItemTable
          :order-id="row.original.id"
          :items="row.original.items"
          :qunatity-controls="false"
          @item-click="onItemClick"
        />
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
          >{{ $t(`orderStatus.${row.original.status}`) }}</span
        >
      </template>
      <template #total-cell="{ row }">
        <span>{{ `${row.original.total.toFixed(2)} ₴` }}</span>
      </template>
      <template #createdAt-cell="{ row }">
        <span>{{ row.original.createdAt }}</span>
      </template>
      <template #postOffice-cell="{ row }">
        <span class="text-wrap" v-if="row.original.postOffice?.name">{{
          `${row.original.postOffice.name}, ${$t(
            `${row.original.postOffice.settlement.region.name}.${row.original.postOffice.settlement.name}`,
          )}`
        }}</span>
        <div v-else></div>
      </template>
    </UTable>
    <UPagination
      color="main"
      active-color="main"
      v-model:page="pagination.page"
      :items-per-page="pagination.pageSize"
      :total="totalItems"
      @update:page="onPageChange"
      class="pt-2.5 pb-2.5"
      :ui="{
        item: 'aria-[current=page]:text-white duration:300',
      }"
    />
  </div>
</template>
