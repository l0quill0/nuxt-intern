<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { login, register } from "~/api/authApi";
import { PublicRoutes } from "~/enums/routes.enum";

const toast = useToast();
const tokenStore = useTokenStore();
const userStore = useUserStore();
const compStore = useCompStore();

const schema = zod
  .object({
    email: zod.email("Введіть email").toLowerCase(),
    name: zod.string("Введіть ім'я").min(3, "Мінімум 3 символів"),
    password: zod.string("Введіть пароль").min(6, "Мінімум 6 символів"),
    confirmPassword: zod
      .string("Підтвердіть пароль")
      .min(6, "Мінімум 6 символів"),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Паролі не збігаються",
      path: ["confirmPassword"],
    },
  );

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  name: undefined,
  password: undefined,
  confirmPassword: undefined,
});

const showPassword = ref(false);

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await register(event.data);
    const response = await login(event.data);
    tokenStore.setToken(response.access_token);
    await userStore.fetchUser();
    toast.add({
      title: "Реєстрація успішна",
      color: "success",
    });
    compStore.clearAll();
    navigateTo(PublicRoutes.HOME);
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
    return;
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    :validate-on="['blur']"
    class="bg-main-400 p-10 min-w-62.5 gap-3"
  >
    <h2 class="font-bold text-2xl text-white">Реестрація</h2>
    <UFormField label="Ім'я" name="name">
      <UInput
        class="w-62.5"
        v-model="state.name"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UFormField label="Email" name="email">
      <UInput
        class="w-62.5"
        v-model="state.email"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UFormField label="Пароль" name="password">
      <UInput
        class="w-62.5"
        v-model="state.password"
        :type="showPassword ? 'text' : 'password'"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="showPassword ? 'i-lucide-eye' : 'i-lucide-eye-off'"
            @click="showPassword = !showPassword"
          /> </template
      ></UInput>
    </UFormField>
    <UFormField label="Пітдверження паролю" name="confirmPassword">
      <UInput
        class="w-62.5"
        :type="showPassword ? 'text' : 'password'"
        v-model="state.confirmPassword"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UButton type="submit" color="success" :disabled="hasErrors"
      >Зареєструватись</UButton
    >
    <NuxtLink
      :to="PublicRoutes.LOGIN"
      class="text-white hover:underline active:text-main-300 duration-300"
      >Повернутись</NuxtLink
    >
  </UForm>
</template>
