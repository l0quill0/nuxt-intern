<script setup lang="ts">
import type { IComment } from "~/types/product.types";
import { Trash } from "lucide-vue-next";
import { deleteComment } from "~/api/productApi";
const emit = defineEmits<{
  (e: "commentDeleted"): void;
}>();

const user = useUserStore().getUser();
const toast = useToast();

const props = defineProps<{ comment: IComment; productId: number }>();

const onDeleteClick = async (id: number) => {
  try {
    await deleteComment(props.productId, id);
    emit("commentDeleted");
    toast.add({ title: "Видалено", color: "success" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
};
</script>

<template>
  <div
    class="flex flex-col w-full p-4 mt-2 justify-items-start group bg-accent-100"
  >
    <div class="flex gap-1.5">
      <p>{{ Number(comment.score).toFixed(1) }}</p>
      <NuxtRating :rating-value="Number(comment.score)" />
      <p>{{ comment.author.name }}</p>
      <UButton
        v-if="comment.author.id === user?.id || user?.role === 'ADMIN'"
        variant="ghost"
        class="p-0 w-3.5 h-3.5 self-center ml-auto opacity-0 group-hover:opacity-100 transition-opacity ease-in hover:bg-transparent"
        @click="onDeleteClick(comment.id)"
        ><Trash class="w-3.5 h-3.5 text-main-400"
      /></UButton>
    </div>
    <p class="break-all">{{ comment.text }}</p>
  </div>
</template>
