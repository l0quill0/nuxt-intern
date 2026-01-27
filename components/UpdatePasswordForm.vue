<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { updatePassword } from "~/api/userApi";

const toast = useToast();

const schema = zod
  .object({
    oldPassword: zod
      .string("Введіть старий пароль")
      .min(6, "Мінімум 6 символів"),
    newPassword: zod
      .string("Введіть наовий пароль")
      .min(6, "Мінімум 6 символів"),
    confirmPassword: zod
      .string("Підтвердіть пароль")
      .min(6, "Мінімум 6 символів"),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    error: "Пароль не змінився",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

type Schema = zod.output<typeof schema>;

const state = reactive<Schema>({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const isDismissable = ref(true);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isDismissable.value = false;
    await updatePassword(event.data);
    state.oldPassword = "";
    state.newPassword = "";
    state.confirmPassword = "";
    isDismissable.value = true;
    toast.add({ title: "Пароль змінений", color: "success" });
  } catch (error) {
    toast.add({ title: $t(`errorMessage.${error as string}`), color: "error" });
    isDismissable.value = true;
  }
}
</script>

<template>
  <UModal
    :aria-describedby="undefined"
    description="PasswordUpdate"
    title="PasswordUpdate"
    :ui="{
      overlay: 'bg-[#f0f0f0b2]',
    }"
    class="lg:w-fit"
    :dismissible="isDismissable"
  >
    <template #content>
      <UForm
        :schema="schema"
        :state="state"
        class="p-10 bg-main-400 gap-2.5"
        @submit="onSubmit"
      >
        <UFormField label="Старий пароль" name="oldPassword" class="w-full">
          <UInput
            class="w-full"
            v-model="state.oldPassword"
            :type="showOldPassword ? 'text' : 'password'"
            :ui="{
              base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
            }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showOldPassword ? 'i-lucide-eye' : 'i-lucide-eye-off'"
                @click="showOldPassword = !showOldPassword"
              /> </template
          ></UInput>
        </UFormField>
        <UFormField label="Новий пароль" name="newPassword" class="w-full">
          <UInput
            class="w-full"
            v-model="state.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            :ui="{
              base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
            }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showNewPassword ? 'i-lucide-eye' : 'i-lucide-eye-off'"
                @click="showNewPassword = !showNewPassword"
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
            :type="showNewPassword ? 'text' : 'password'"
            v-model="state.confirmPassword"
            :ui="{
              base: 'bg-transparent! rounded-none ring-white focus-visible:ring-white aria-invalid:ring-error aria-invalid:focus-visible:ring-error',
            }"
        /></UFormField>
        <UButton color="success" type="submit" :disabled="hasErrors"
          >Змінити пароль</UButton
        >
      </UForm>
    </template>
  </UModal>
</template>
