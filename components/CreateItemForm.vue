<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { getCategories } from "~/api/categoryApi";
import { createItem } from "~/api/itemApi";

const emit = defineEmits<{ (e: "uploading", isDismissable: boolean): void }>();
const toast = useToast();

const schema = zod.object({
  title: zod
    .string("Введіть назву товару")
    .min(3, "Мінімум 3 символи")
    .max(15, "Максимум 15 символів"),
  description: zod.string("Додайте опис товару").min(3, "Мінімум 3 символи"),
  price: zod.coerce
    .number("Зазначте ціну товару")
    .min(0.01, "Мініальна вартість 0.01"),
  category: zod.string("Оберіть категорію"),
  image: zod.instanceof(File, { message: "Додайте фото товару" }),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  price: undefined,
  image: undefined,
  category: undefined,
});

const { data: categories } = await getCategories();

const categoryItems = computed<{ label: string; value: string }[]>(
  () =>
    categories.value?.map((c) => ({
      label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
      value: c.slug,
    })) ?? []
);

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);
const isUploading = ref<number | null>(0);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    emit("uploading", true);
    isUploading.value = null;
    await createItem(event.data);
    state.title = undefined;
    state.description = undefined;
    state.price = undefined;
    state.image = undefined;
    state.category = undefined;
    isUploading.value = 100;
    emit("uploading", false);
    refreshNuxtData("items-paginated");
    toast.add({ title: "Товар створено", color: "success" });
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
    @submit="onSubmit"
    class="flex flex-col items-center justify-center min-w-[250px] p-4 bg-[#333333] gap-2.5"
  >
    <h2 class="font-bold text-2xl text-white">Створення товару</h2>
    <UFormField label="Назва товару" name="title" class="w-full">
      <UInput
        v-model="state.title"
        class="w-full"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UFormField label="Ціна товару" name="price" class="w-full">
      <UInput
        class="w-full"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
        v-model="state.price"
        @beforeinput="formatToFloat"
      />
    </UFormField>
    <UFormField label="Категорія" class="w-full">
      <USelectMenu
        :items="categoryItems.map((m) => m)"
        class="w-full"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
          content: 'rounded-none bg-[#333333] ring-white',
          input: 'border-white ',
          item: 'before:rounded-none data-highlighted:bg-gray-500',
          trailingIcon: 'text-white',
        }"
        :search-input="{
          placeholder: 'Пошук...',
        }"
        value-key="value"
        v-model="state.category"
      />
    </UFormField>
    <UFormField label="Опис товару" name="description" class="w-full">
      <UTextarea
        v-model="state.description"
        :autoresize="false"
        class="w-full h-24"
        :ui="{
          base: 'resize-none bg-transparent rounded-none ring-white focus-visible:ring-white h-24',
        }"
      ></UTextarea>
    </UFormField>
    <UFormField label="Фото товару" name="image" class="w-full">
      <UProgress
        animation="swing"
        v-model="isUploading"
        color="neutral"
        :ui="{ base: 'rounded-none bg-[#333333]', indicator: 'rounded-none' }"
      />
      <UFileUpload
        label="Фото товару"
        name="image"
        v-model="state.image"
        class="w-full bg-white"
        :ui="{
          base: 'bg-white border-none rounded-none',
          label: 'text-black',
        }"
      />
    </UFormField>
    <UButton
      class="hover:bg-gray-500 active:bg-gray-700 rounded-none bg-white text-[#333333] disabled:bg-gray-400"
      type="submit"
      :disabled="hasErrors || isUploading === null"
    >
      Створити товар
    </UButton>
  </UForm>
</template>
