<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { register } from "~/api/authApi";

const schema = zod
  .object({
    email: zod.email("Введіть email"),
    name: zod.string("Введіть ім'я").min(3, "Мінімум 3 символів"),
    password: zod.string("Введіть пароль").min(6, "Мінімум 6 символів"),
    confirmPassword: zod.string("Підтвердіть пароль").min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Паролы не збігаються",
    path: ["password", "confirmPassword"],
  });

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  name: undefined,
  password: undefined,
  confirmPassword: undefined,
});

const toast = useToast();

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await register(event.data);
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
    return;
  }

  toast.add({
    title: "Реєстрація успішна, будь ласька авторизуйтесь",
    color: "success",
  });
  navigateTo("/login");
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="flex flex-col items-center w-1/4 bg-[#333333] p-3 min-w-[250px] min-h-1/2 gap-3 justify-center"
  >
    <h2 class="font-bold text-2xl text-white">Реестрація</h2>
    <UFormField label="Ім'я" name="name">
      <UInput
        class="w-full"
        v-model="state.name"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UFormField label="Email" name="email">
      <UInput
        class="w-full"
        v-model="state.email"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UFormField label="Пароль" name="password">
      <UInput
        class="w-full"
        v-model="state.password"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UFormField label="Пітдверження паролю" name="confirmPassword">
      <UInput
        class="w-full"
        v-model="state.confirmPassword"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>

    <UButton
      type="submit"
      class="hover:bg-gray-500 active:bg-gray-700 rounded-none bg-white text-[#333333] disabled:bg-gray-400"
      :disabled="hasErrors"
      >Зареєструватись</UButton
    >
    <NuxtLink
      to="/login"
      class="text-white hover:underline active:text-gray-700"
      >Повернутися</NuxtLink
    >
  </UForm>
</template>
