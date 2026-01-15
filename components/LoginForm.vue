<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { login } from "~/api/authApi";
import { PublicRoutes } from "~/enums/routes.enum";

const schema = zod.object({
  email: zod.email("Введіть email").toLowerCase(),
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
const compStore = useCompStore();

const showPassword = ref(false);

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await login(event.data);
    tokenStore.setToken(response.access_token);
    await userStore.fetchUser();
    toast.add({ title: "Авторизація успішна", color: "success", ui: {} });
    await refreshNuxtData("count");
    compStore.clearAll();
    navigateTo(PublicRoutes.HOME);
  } catch (error) {
    toast.add({
      title: error as string,
      color: "error",
    });
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    :validate-on="['blur']"
    @submit="onSubmit"
    class="bg-main-400 p-10 gap-5"
  >
    <h2 class="font-bold text-2xl text-white">Авторизація</h2>
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
        :type="showPassword ? 'text' : 'password'"
        v-model="state.password"
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
    <UButton type="submit" color="success" :disabled="hasErrors"
      >Авторизуватись</UButton
    >
    <NuxtLink
      :to="PublicRoutes.REGISTER"
      class="text-white hover:underline active:text-main-300 duration-300"
      >Зареєструватись</NuxtLink
    >
  </UForm>
</template>
