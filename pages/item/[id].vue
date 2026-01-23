<script setup lang="ts">
import { getComments, getProductById } from "~/api/productApi";
import type { IComment } from "~/types/product.types";

const route = useRoute();
const user = useUserStore().getUser();

const itemId = Number(route.params.id);

const { data: response, refresh } = getProductById(itemId);

const page = ref(1);

const { data: responseComm, refresh: refreshComm } = await getComments(
  itemId,
  page,
);

const item = computed(() => response.value);
const hasNextPage = computed(
  () =>
    responseComm.value &&
    responseComm.value?.currentPage < responseComm.value?.totalPages,
);

const comments = ref<IComment[]>([]);

const onItemUpdate = async () => {
  await refresh();
};

const onCommentChange = async () => {
  page.value = 1;
  await refresh();
  await refreshComm();
};

const onLoadMoreClick = async () => {
  page.value = page.value + 1;
};

watch(
  () => responseComm.value,
  (res) => {
    if (!res) return;
    if (res.currentPage === 1) {
      comments.value = res.items;
    } else {
      comments.value = [...comments.value, ...res.items];
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="flex flex-col items-center pt-6.25 lg:pt-33.75 pl-2.5 pr-2.5 lg:pl-0 lg:pr-0 w-full"
  >
    <div class="flex flex-col items-center gap-2.5" v-if="item">
      <ItemInfo :item-info="item" @updateInfo="onItemUpdate" />
      <Suggestions :product-id="itemId" />
      <h2 class="font-bold text-2xl mt-10 mb-1" v-if="comments.length || user">
        Відгуки
      </h2>
      <CreateComment
        :item-id="itemId"
        @comment-create="onCommentChange"
        v-if="user"
      />
      <div
        v-if="comments.length"
        class="max-w-275 w-full overflow-y-scroll max-h-100 pt-2.5 pl-4 xl:px-0"
      >
        <Comment
          v-for="comment in comments"
          :product-id="itemId"
          :comment="comment"
          @comment-deleted="onCommentChange"
        />
      </div>
      <h2 v-else class="font-semibold text-xl mt-5 mb-1">Коментарі відсутні</h2>
      <UButton
        color="main"
        class="text-white"
        @click="onLoadMoreClick"
        v-if="hasNextPage"
        >Завантажити ще</UButton
      >
    </div>
  </div>
</template>
