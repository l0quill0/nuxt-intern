<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { getCategoryById, updateCategory } from "~/api/categoryApi";
import type { ICategory } from "~/types/category.type";

const props = defineProps({
  id: { type: Number, required: true },
});

const toast = useToast();

const { data: response, refresh } = await getCategoryById(props.id);

const category = computed(() => response.value || ({} as ICategory));
const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

const isDismissable = ref(true);
const isUploading = ref<number | null>(0);

const schema = zod.object({
  name: zod
    .string("Введіть назву категорії")
    .min(3, "Мінімум 3 символи")
    .max(10, "Максимум 10 символів")
    .optional(),
  image: zod.instanceof(File, { message: "Додайте фото категорії" }).optional(),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: category.value.name,
  image: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (
    checkForChange({
      initialState: category.value,
      newState: event.data,
      omitKeys: ["image"],
    }) &&
    !state.image
  ) {
    toast.add({ title: "Змін не знайдено", color: "error" });
    return;
  }
  try {
    isUploading.value = null;
    isDismissable.value = false;
    await updateCategory(props.id, event.data);
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
      content: 'rounded-none',
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
        class="flex flex-col items-center justify-center min-w-[250px] p-4 bg-[#333333] gap-2.5"
      >
        <UFormField label="Фото категорії" name="image" class="w-full">
          <UProgress
            animation="swing"
            v-model="isUploading"
            color="neutral"
            :ui="{
              base: 'rounded-none bg-[#333333]',
              indicator: 'rounded-none',
            }" />
          <UFileUpload
            label="Фото категорії"
            name="image"
            v-model="state.image"
            class="w-full bg-white"
            :ui="{
              base: 'bg-white border-none rounded-none',
              label: 'text-black',
            }"
        /></UFormField>
        <UFormField label="Назва" name="name" class="w-full">
          <UInput
            class="w-full"
            v-model="state.name"
            :ui="{
              base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error placeholder:text-white',
            }"
          />
        </UFormField>
        <UButton
          type="submit"
          class="rounded-none"
          color="success"
          :disabled="hasErrors || isUploading === null"
          >Оновити</UButton
        >
      </UForm>
    </template>
  </UModal>
</template>
