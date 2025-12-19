<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { getCategories } from "~/api/categoryApi";
import { getItemById, updateItem } from "~/api/itemApi";
import type { IItem } from "~/types/item.type";

const props = defineProps({
  itemId: { type: Number, required: true },
});

const toast = useToast();

const schema = zod.object({
  title: zod
    .string("Введіть назву товару")
    .min(3, "Мінімум 3 символи")
    .max(15, "Максимум 15 символів"),
  description: zod.string("Додайте опис товару").min(3, "Мінімум 3 символи"),
  price: zod.coerce
    .number("Зазначте ціну товару")
    .min(0.01, "Мініальна вартість 0.01")
    .transform((value) => Number(value)),
  category: zod.string("Оберіть категорію"),
  image: zod.instanceof(File, { message: "Додайте фото товару" }).optional(),
});

const { data: categories } = await getCategories();
const { data: response, refresh } = await getItemById(props.itemId);

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);
const item = computed(() => response.value ?? ({} as IItem));

const isUploading = ref<number | null>(0);
const isDismissable = ref(true);

const categoryItems = computed<{ label: string; value: string }[]>(
  () =>
    categories.value?.map((c) => ({
      label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
      value: c.slug,
    })) ?? []
);
type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: item.value?.title,
  description: item.value?.description,
  price: item.value?.price,
  image: undefined,
  category: item.value?.category.slug,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (
    checkForChange({
      initialState: { ...item.value, category: item.value.category.slug },
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
    await updateItem(props.itemId, event.data);
    await refresh();
    await refreshNuxtData("items-paginated");
    toast.add({ title: "Товар оновлено", color: "success" });
    state.image = undefined;
    isUploading.value = 100;
    isDismissable.value = true;
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
        :validate-on="['blur']"
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
          />
        </UFormField>
        <UFormField label="Ціна товару" name="price" class="w-full">
          <UInput
            class="w-full"
            :ui="{
              base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error placeholder:text-white',
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
