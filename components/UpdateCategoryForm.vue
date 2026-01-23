<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { getCategoryBySlug, updateCategory } from "~/api/categoryApi";
import type { ICategory } from "~/types/category.types";

const props = defineProps({
  slug: { type: String, required: true },
});

const toast = useToast();

const { data: response, refresh } = await getCategoryBySlug(props.slug);

const category = computed(() => response.value || ({} as ICategory));
const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(
  () =>
    !validation.value.success ||
    (checkForChange({
      initialState: category.value,
      newState: state,
      omitKeys: ["image"],
    }) &&
      !state.image),
);

const isDismissable = ref(true);
const isUploading = ref<number | null>(0);

const schema = zod.object({
  image: zod.instanceof(File, { message: "Додайте фото категорії" }),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  image: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isUploading.value = null;
    isDismissable.value = false;
    await updateCategory(props.slug, event.data.image);
    await refresh();
    await refreshNuxtData("category-paginated");
    state.image = undefined;
    isUploading.value = 100;
    isDismissable.value = true;
    toast.add({ title: "Категорія оновлена", color: "success" });
  } catch (error) {
    isUploading.value = 0;
    isDismissable.value = true;
    toast.add({ title: error as string, color: "error" });
  }
}
</script>

<template>
  <UModal
    :aria-describedby="undefined"
    description="CategoryUpdate"
    title="CategoryUpdate"
    :ui="{
      overlay: 'bg-[#f0f0f0b2]',
    }"
    :dismissible="isDismissable"
  >
    <template #content>
      <UForm
        :validate-on="['blur']"
        @submit="onSubmit"
        :schema="schema"
        :state="state"
        class="p-4 bg-main-400 gap-2.5"
      >
        <UFormField label="Фото категорії" name="image" class="w-full">
          <UProgress
            animation="swing"
            v-model="isUploading"
            color="main"
            :ui="{ base: 'bg-accent-50' }" />
          <UFileUpload
            label="Фото категорії"
            name="image"
            v-model="state.image"
            class="w-full"
            :ui="{
              base: 'bg-white hover:bg-accent-50',
              label: 'text-main-400',
            }"
        /></UFormField>
        <UButton
          type="submit"
          color="success"
          :disabled="hasErrors || isUploading === null"
          >Оновити</UButton
        >
      </UForm>
    </template>
  </UModal>
</template>
