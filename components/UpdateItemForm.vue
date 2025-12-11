<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { getCategories } from "~/api/categoryApi";
import { getItemById, updateItem } from "~/api/itemApi";
import { every, values } from "lodash";

const props = defineProps({
  itemId: { type: Number, required: true },
});

const schema = zod.object({
  title: zod.string("Введіть назву товару").min(5, "Назва коротка").optional(),
  description: zod
    .string("Додайте опис товару")
    .min(5, "Опис малий")
    .optional(),
  price: zod.number("Зазначте ціну товару").min(0.01).optional(),
  categoryName: zod.string("Оберіть категорію").optional(),
  image: zod.instanceof(File, { message: "Додайте фото товару" }).optional(),
});

const toast = useToast();
const menuItems = ref<Array<string>>([]);

const { data: categories } = await getCategories();
const { data: item } = await getItemById(props.itemId);
const { title, description, image, price, categoryName } = item.value || {};

watchEffect(() => {
  if (categories.value) {
    menuItems.value = categories.value.map((c) => c.name);
  }
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  price: undefined,
  image: undefined,
  categoryName: undefined,
});

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);
const isUploading = ref<number | null>(0);

const checkForChange = () => {
  const stateValues = values(state);
  if (every(stateValues, (v) => v === undefined)) return false;
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!checkForChange()) {
    toast.add({ title: "Змін не знайдено", color: "error" });
    return;
  }

  try {
    isUploading.value = null;
    await updateItem(props.itemId, event.data);
    toast.add({ title: "Товар створено", color: "success" });
    state.title = undefined;
    state.description = undefined;
    state.price = undefined;
    state.image = undefined;
    state.categoryName = undefined;
    isUploading.value = 100;
  } catch (error) {
    isUploading.value = 0;
    toast.add({ title: error as string, color: "error" });
  }
}
</script>

<template>
  <UForm
    v-if="item"
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="flex flex-col items-center justify-center min-w-[250px] p-4 bg-[#333333] gap-2.5"
  >
    <h2 class="font-bold text-2xl text-white">Оновлення товару</h2>
    <UFormField label="Назва товару" name="title" class="w-full">
      <UInput
        v-model="state.title"
        class="w-full"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
        :placeholder="title"
      />
    </UFormField>
    <UFormField label="Ціна товару" name="price" class="w-full">
      <UInputNumber
        v-model="state.price"
        :placeholder="price?.toFixed(2)"
        :min="0.01"
        :max-fraction-digits="2"
        :step="0.01"
        orientation="vertical"
        class="w-full"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UFormField label="Категорії" class="w-full">
      <USelectMenu
        v-model="state.categoryName"
        :placeholder="categoryName?.name"
        :items="menuItems.map((m) => m)"
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
      />
    </UFormField>
    <UFormField label="Опис товару" name="description" class="w-full">
      <UTextarea
        v-model="state.description"
        :autoresize="false"
        :placeholder="description"
        class="w-full h-24"
        :ui="{
          base: 'resize-none bg-transparent rounded-none ring-white focus-visible:ring-white placeholder:text-white h-24',
        }"
      ></UTextarea>
    </UFormField>
    <UFormField label="Фото товару" name="image" class="w-full">
      <UProgress
        animation="swing"
        v-model="isUploading"
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
      Оновити товар
    </UButton>
  </UForm>
</template>
