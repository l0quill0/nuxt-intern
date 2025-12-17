<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { getCategories } from "~/api/categoryApi";
import { getItemById, updateItem } from "~/api/itemApi";
import { every, isEqual, isUndefined, omit, omitBy, values } from "lodash";

const props = defineProps({
  itemId: { type: Number, required: true },
});

const schema = zod.object({
  title: zod
    .string("Введіть назву товару")
    .min(3, "Мінімум 3 символи")
    .max(15, "Максимум 15 символів")
    .optional(),
  description: zod
    .string("Додайте опис товару")
    .min(3, "Мінімум 3 символи")
    .optional(),
  price: zod
    .number("Зазначте ціну товару")
    .min(0.01, "Мініальна вартість 0.01")
    .optional(),
  category: zod.string("Оберіть категорію").optional(),
  image: zod.instanceof(File, { message: "Додайте фото товару" }).optional(),
});

const toast = useToast();
const menuItems = ref<{ label: string; value: string }[]>([]);
const isDismissable = ref(false);

const { data: categories } = await getCategories();
const { data: item, refresh } = await getItemById(props.itemId);
const { title, description, image, price, category } = item.value || {};

watchEffect(() => {
  if (categories.value)
    menuItems.value = categories.value.map((c) => ({
      label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
      value: c.slug,
    }));
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  price: undefined,
  image: undefined,
  category: undefined,
});

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);
const isUploading = ref<number | null>(0);

const checkForChange = () => {
  if (state.image) return true;

  const stateValues = values(state);
  if (every(stateValues, (v) => v === undefined)) return false;

  const clean = (obj: object) => omitBy(omit(obj, ["image"]), isUndefined);

  if (item.value) {
    return !isEqual(clean(state), clean(item.value));
  }

  return false;
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!checkForChange()) {
    toast.add({ title: "Змін не знайдено", color: "error" });
    return;
  }

  try {
    isUploading.value = null;
    isDismissable.value = false;
    await updateItem(props.itemId, event.data);
    toast.add({ title: "Товар оновлено", color: "success" });
    state.title = undefined;
    state.description = undefined;
    state.price = undefined;
    state.image = undefined;
    state.category = undefined;
    isUploading.value = 100;
    isDismissable.value = true;
    refreshNuxtData("items-paginated");
  } catch (error) {
    isUploading.value = 0;
    isDismissable.value = true;
    toast.add({ title: error as string, color: "error" });
  }
}

watch(
  () => props.itemId,
  () => refresh(),
  { immediate: true }
);
</script>

<template>
  <UModal
    :aria-describedby="undefined"
    description="ItemUpdate"
    title="ItemUpdate"
    :ui="{
      content: 'rounded-none',
      overlay: 'bg-[#f0f0f0b2]',
    }"
    :dismissible="isDismissable"
  >
    <template #content>
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
              base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error placeholder:text-white',
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
              base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error placeholder:text-white',
            }"
          />
        </UFormField>
        <UFormField label="Категорія" class="w-full">
          <USelectMenu
            :placeholder="category?.name"
            :items="menuItems.map((m) => m)"
            class="w-full"
            :ui="{
              base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
              placeholder: 'text-white',
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
            color="neutral"
            :ui="{
              base: 'rounded-none bg-[#333333]',
              indicator: 'rounded-none',
            }"
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
  </UModal>
</template>
