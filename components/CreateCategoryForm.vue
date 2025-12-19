<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { createCategory } from "~/api/categoryApi";

const emit = defineEmits<{ (e: "uploading", isDismissable: boolean): void }>();

const toast = useToast();

const schema = zod.object({
  name: zod
    .string("Введіть назву категорії")
    .min(3, "Мінімум 3 символи")
    .max(10, "Максимум 10 символів"),
  image: zod.instanceof(File, { message: "Додайте фото категорії" }),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  image: undefined,
});

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

const isUploading = ref<number | null>(0);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isUploading.value = null;
    emit("uploading", true);
    await createCategory(event.data.image, event.data.name.toLowerCase());
    await refreshNuxtData("categories");
    await refreshNuxtData("category-paginated");
    state.name = undefined;
    state.image = undefined;
    isUploading.value = 100;
    toast.add({ title: "Категорію створено", color: "success" });
    emit("uploading", false);
  } catch (error) {
    emit("uploading", false);
    isUploading.value = 0;
    toast.add({ title: error as string, color: "error" });
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    :validate-on="['blur']"
    class="flex flex-col items-center justify-center bg-[#333333] p-4 gap-2.5"
    @submit="onSubmit"
  >
    <h2 class="font-bold text-2xl text-white">Створення категорії</h2>
    <UFormField label="Фото категорії" name="image" class="w-full">
      <UProgress
        animation="swing"
        v-model="isUploading"
        color="neutral"
        :ui="{ base: 'rounded-none bg-[#333333]', indicator: 'rounded-none' }"
      />
      <UFileUpload
        label="Фото категорії"
        name="image"
        v-model="state.image"
        class="w-full bg-white"
        :ui="{
          base: 'bg-white border-none rounded-none',
          label: 'text-black',
        }"
      />
    </UFormField>
    <UFormField label="Назва" name="name" class="w-full">
      <UInput
        class="w-full"
        v-model="state.name"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UButton
      type="submit"
      class="hover:bg-gray-500 active:bg-gray-700 rounded-none bg-white text-[#333333] disabled:bg-gray-400"
      :disabled="hasErrors || isUploading === null"
      >Створити</UButton
    >
  </UForm>
</template>
