<script setup lang="ts">
const props = defineProps({
  itemId: { type: Number, required: true },
});

const emit = defineEmits<{
  (e: "commentCreate"): void;
}>();

import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { addComment } from "~/api/itemApi";

const toast = useToast();

const schema = zod.object({
  text: zod.string("Додайте відгук").nonempty("Додайте відгук"),
  score: zod.number("Додайте оцінку"),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  text: undefined,
  score: undefined,
});

const value = ref(0);
const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    await addComment(props.itemId, event.data);
    state.text = undefined;
    state.score = undefined;
    value.value = 0;
    emit("commentCreate");
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
};
</script>

<template>
  <UForm
    @submit="onSubmit"
    :schema="schema"
    :state="state"
    class="w-full items-end max-w-275"
  >
    <div class="flex gap-1.5 items-center">
      <p v-if="value > 0">{{ value }}</p>
      <NuxtRating
        :read-only="false"
        @rating-hovered="(e) => (value = e)"
        @rating-selected="(e) => ((state.score = e), (value = e))"
      />
    </div>
    <UFormField class="w-full h-20" name="text"
      ><UTextarea
        v-model="state.text"
        :placeholder="'Залиште коментар'"
        variant="none"
        class="w-full h-20"
        :ui="{
          base: 'bg-transparent  rounded-none border-b-accent-100 text-main-400 resize-none aria-invalid:ring-0',
        }"
    /></UFormField>
    <UButton type="submit" color="main" class="text-white" :disabled="hasErrors"
      >Надіслати</UButton
    >
  </UForm>
</template>
