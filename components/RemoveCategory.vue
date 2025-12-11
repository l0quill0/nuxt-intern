<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { deleteCategory, getCategories } from "~/api/categoryApi";

const state = reactive({
  name: "",
});

const toast = useToast();
const isDisabled = ref(true);

const menuItems = ref<Array<string>>([]);

const { data: categories, refresh } = await getCategories();

watchEffect(() => {
  if (categories.value) {
    menuItems.value = categories.value
      .map((c) => c.name)
      .filter((c) => c !== "Інше");
  }
});
watch(state, () => {
  state.name !== "";
  isDisabled.value = false;
});

async function onSubmit(event: FormSubmitEvent<Record<string, string>>) {
  try {
    const category = categories.value?.find((c) => c.name === event.data.name);
    if (category) {
      await deleteCategory(category.id);
      await refresh();
      state.name = "";
      toast.add({ title: "Категорія видалена", color: "success" });
    }
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
}
</script>
<template>
  <UForm
    :state="state"
    @submit="onSubmit"
    class="flex flex-col items-center justify-center bg-[#333333] p-4 gap-2.5"
  >
    <h2 class="font-bold text-2xl text-white">Видалити категорію</h2>
    <UFormField label="Категорії" name="name" class="w-full">
      <USelectMenu
        v-model="state.name"
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
    <UButton
      type="submit"
      color="error"
      class="hover:bg-gray-500 active:bg-gray-700 rounded-none bg-white text-[#333333] disabled:bg-gray-400"
      :disabled="isDisabled"
      >Видалити</UButton
    >
  </UForm>
</template>
