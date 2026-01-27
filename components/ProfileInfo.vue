<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as zod from "zod";
import { getMe, updateMe } from "~/api/userApi";
import type { IUser } from "~/types/auth.types";

const userStore = useUserStore();
const user = userStore.getUser() as IUser;
const toast = useToast();

const isEditing = ref(false);
const form = ref();

const schema = zod.object({
  email: zod.email("Невірний формат").optional(),
  name: zod
    .string()
    .min(3, "Мінімум 3 символи")
    .max(12, "Максимум 12 символів")
    .optional(),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: user.email,
  name: user.name === "empty" ? undefined : user.name,
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
      initialState: user,
      newState: event.data,
    })
  ) {
    toast.add({ title: "Змін не знайдено", color: "error" });
    return;
  }
  try {
    await updateMe(event.data);
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
    </div>
    <div class="flex gap-2">
      <UButton
        v-if="isEditing"
        type="submit"
        color="success"
        class="w-25 flex justify-center"
        >Зберегти</UButton
      >
      <UButton
        v-else
        color="success"
        @click="isEditing = true"
        :disabled="isEditing"
        class="w-25 flex justify-center"
        >Редагувати</UButton
      >
      <UButton @click="() => onCancel()" color="error" :disabled="!isEditing"
        >Скасувати</UButton
      >
    </div>
  </UForm>
</template>
