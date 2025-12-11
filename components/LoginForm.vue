<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { login } from "~/api/authApi";

const schema = zod.object({
  email: zod.email("Введіть email"),
  password: zod.string("Введіть пароль").min(6, "Мінімум 6 символів"),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const toast = useToast();
const tokenStore = useTokenStore();
const userStore = useUserStore();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await login(event.data);
    tokenStore.setToken(response.access_token);
    await userStore.fetchUser();
  } catch (error: any) {
    toast.add({
      title: error as string,
      color: "error",
    });
    return;
  }

  toast.add({ title: "Авторизація успішна", color: "success", ui: {} });
  navigateTo("/");
}

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="flex flex-col items-center justify-center w-1/4 bg-[#333333] p-3 min-h-1/3 min-w-[250px] gap-3"
  >
    <h2 class="font-bold text-2xl text-white">Авторизація</h2>
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
        type="password"
        v-model="state.password"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UButton
      type="submit"
      class="hover:bg-slate-500 active:bg-gray-700 rounded-none bg-white text-[#333333] disabled:bg-gray-400 duration-300"
      :disabled="hasErrors"
      >Авторизуватись</UButton
    >
    <NuxtLink
      to="/register"
      class="text-white hover:underline active:text-gray-700 duration-300"
      >Зареєструватись</NuxtLink
    >
  </UForm>
</template>
