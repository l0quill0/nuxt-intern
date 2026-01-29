<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { login, register } from "~/api/authApi";
import { PublicRoutes } from "~/enums/routes.enum";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { isoToEmoji } from "~/utils/isoToEmoji";

const toast = useToast();
const tokenStore = useTokenStore();
const userStore = useUserStore();
const compStore = useCompStore();
const phoneUtil = PhoneNumberUtil.getInstance();

const countrySelectOptions = phoneUtil.getSupportedRegions().map((code) => {
  return {
    label: `${isoToEmoji(code)} +${phoneUtil.getCountryCodeForRegion(code)}`,
    value: phoneUtil.getCountryCodeForRegion(code),
  };
});

const schema = zod
  .object({
    email: zod.email("Введіть email").toLowerCase(),
    name: zod.string("Введіть ім'я").min(3, "Мінімум 3 символів"),
    phone: zod.string("Введіть номер телефону").refine(
      (value) => {
        if (!value || !countryCode.value) return false;

        try {
          const region = phoneUtil.getRegionCodeForCountryCode(
            countryCode.value,
          );

          const phoneNumber = phoneUtil.parse(value, region);

          return phoneUtil.isValidNumber(phoneNumber);
        } catch {
          return false;
        }
      },
      { message: "Не дійсний номер телефону" },
    ),
    password: zod.string("Введіть пароль").min(6, "Мінімум 6 символів"),
    confirmPassword: zod
      .string("Підтвердіть пароль")
      .min(6, "Мінімум 6 символів"),
  })
  .refine(
    ({ password, confirmPassword }) => {
      return password === confirmPassword;
    },
    {
      message: "Паролі не збігаються",
      path: ["confirmPassword"],
    },
  );

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  phone: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
});

const showPassword = ref(false);
const countryCode = ref<number>();

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const region = phoneUtil.getRegionCodeForCountryCode(countryCode.value!);
    const phoneNumber = phoneUtil.parse(event.data.phone, region);
    await register({
      ...event.data,
      phone: phoneUtil
        .format(phoneNumber, PhoneNumberFormat.INTERNATIONAL)
        .replaceAll(" ", ""),
    });
    const response = await login({
      identifier: event.data.email,
      password: event.data.password,
    });
    tokenStore.setToken(response.access_token);
    await userStore.fetchUser();
    toast.add({
      title: "Реєстрація успішна",
      color: "success",
    });
    compStore.clearAll();
    navigateTo(PublicRoutes.HOME);
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
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
    class="bg-main-400 p-10 min-w-130 gap-3"
  >
    <h2 class="font-bold text-2xl text-white">Реестрація</h2>
    <UFormField label="Ім'я" name="name" class="w-full">
      <UInput
        class="w-full"
        v-model="state.name"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>
    <UFormField label="Email" name="email" class="w-full">
      <UInput
        class="w-full"
        v-model="state.email"
        :ui="{
          base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
        }"
      />
    </UFormField>

    <UFormField label="Номер телефону" name="phone" class="w-full">
      <div class="flex gap-0.5 h-fit items-end w-full">
        <USelectMenu
          :items="countrySelectOptions"
          v-model="countryCode"
          value-key="value"
          class="w-25"
          :ui="{
            base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
            content: 'rounded-none bg-main-400 ring-white',
            input: 'border-white ',
            item: 'before:rounded-none data-highlighted:bg-main-300',
            trailingIcon: 'text-white',
          }"
          :search-input="{
            placeholder: 'Пошук...',
            ui: {
              base: 'placeholder:text-white',
            },
          }"
        ></USelectMenu>
        <UInput
          class="w-full"
          v-model="state.phone"
          :ui="{
            base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
          }"
          @beforeinput="fromatToInt"
        />
      </div>
    </UFormField>
    <UFormField label="Пароль" name="password" class="w-full">
      <UInput
        class="w-full"
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
    <UFormField
      label="Пітдверження паролю"
      name="confirmPassword"
      class="w-full"
    >
      <UInput
        class="w-full"
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
