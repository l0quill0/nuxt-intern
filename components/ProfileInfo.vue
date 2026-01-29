<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import * as zod from "zod";
import { getMe, updateMe } from "~/api/userApi";
import type { IUser } from "~/types/auth.types";

const userStore = useUserStore();
const user = userStore.getUser() as IUser;
const toast = useToast();
const phoneUtil = PhoneNumberUtil.getInstance();

const countrySelectOptions = phoneUtil.getSupportedRegions().map((code) => {
  return {
    label: `${isoToEmoji(code)} +${phoneUtil.getCountryCodeForRegion(code)}`,
    value: phoneUtil.getCountryCodeForRegion(code),
  };
});

const phoneNumberCurrent = phoneUtil.parse("+" + user.phone);

const isEditing = ref(false);
const form = ref();
const countryCode = ref<number | undefined>(
  phoneNumberCurrent.getCountryCode(),
);

const schema = zod.object({
  email: zod.email("Невірний формат").optional(),
  name: zod
    .string()
    .min(3, "Мінімум 3 символи")
    .max(20, "Максимум 20 символів")
    .optional(),
  phone: zod
    .string("Введіть номер телефону")
    .refine(
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
    )
    .optional(),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: user.email,
  name: user.name === "empty" ? undefined : user.name,
  phone: phoneNumberCurrent.getNationalNumber()?.toString(),
});

function onCancel() {
  isEditing.value = false;
  state.email = user.email;
  ((state.name = user.name === "empty" ? undefined : user.name),
    form.value.clear());
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (
    checkForChange({
      initialState: {
        ...user,
        phone: phoneNumberCurrent.getNationalNumber()?.toString(),
      },
      newState: event.data,
    })
  ) {
    toast.add({ title: "Змін не знайдено", color: "error" });
    return;
  }
  try {
    const region = phoneUtil.getRegionCodeForCountryCode(countryCode.value!);
    const phoneNumber = phoneUtil.parse(event.data.phone, region);
    await updateMe({
      ...event.data,
      phone: phoneUtil
        .format(phoneNumber, PhoneNumberFormat.INTERNATIONAL)
        .replaceAll(" ", ""),
    });
    const { data: response } = await getMe();
    if (response.value) userStore.setUser(response.value);
    isEditing.value = false;
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="gap-3 p-5 w-full"
  >
    <h2 class="font-bold text-2xl text-white">Мій профіль</h2>
    <div class="flex flex-col gap-6 w-full">
      <UFormField label="Email" name="email" class="w-full">
        <UInput
          v-model="state.email"
          :disabled="!isEditing"
          variant="none"
          :class="isEditing ? 'border-white' : ' border-transparent'"
          class="w-full border-b"
        />
      </UFormField>
      <UFormField label="Ім'я" name="name" class="w-full">
        <UInput
          v-model="state.name"
          :disabled="!isEditing"
          variant="none"
          :class="isEditing ? ' border-white' : ' border-transparent'"
          class="w-full border-b"
        />
      </UFormField>
      <UFormField label="Номер телефону" name="phone" class="w-full">
        <div class="flex gap-0.5 h-fit items-end w-full">
          <USelectMenu
            :items="countrySelectOptions"
            v-model="countryCode"
            value-key="value"
            class="w-25 ring-0 border-b rounded-none"
            :class="isEditing ? 'border-white' : ' border-transparent'"
            :ui="{
              base: 'bg-transparent! rounded-0 ',
              content: 'rounded-none bg-main-400 ring-0',
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
            :disabled="!isEditing"
          ></USelectMenu>
          <UInput
            class="w-full border-b"
            v-model="state.phone"
            :class="isEditing ? 'border-white' : ' border-transparent'"
            :disabled="!isEditing"
            :ui="{
              base: 'bg-transparent! rounded-none ring-0 ',
            }"
            @beforeinput="fromatToInt"
          />
        </div>
      </UFormField>
    </div>
    <div class="flex gap-2 w-full justify-center">
      <UButton v-if="isEditing" type="submit" color="success">Зберегти</UButton>
      <UButton v-else color="success" @click="isEditing = true"
        >Редагувати</UButton
      >
      <UButton v-if="isEditing" @click="() => onCancel()" color="error"
        >Скасувати</UButton
      >
    </div>
  </UForm>
</template>
