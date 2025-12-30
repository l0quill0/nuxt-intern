<script setup lang="ts">
import { createOrder } from "~/api/orderApi";
import * as zod from "zod";
import { getPostOffices } from "~/api/postApi";
import { Regions } from "~/types/region.enum";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = zod.object({
  region: zod.string("Оберіть область"),
  postOffice: zod.string("Оберіть пункт видачі"),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  region: undefined,
  postOffice: undefined,
});

const regions = Object.keys(Regions).map((k) => ({
  value: k,
  label: Regions[k as keyof typeof Regions],
}));

const postOffices = ref<string[]>([]);

const emit = defineEmits<{ (e: "orderSent"): void }>();

const toast = useToast();
const user = useUserStore().getUser();

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    await createOrder(event.data.postOffice);
    await refreshNuxtData("count");
    await refreshNuxtData("orderPagiantion");
    state.postOffice = undefined;
    state.region = undefined;
    toast.add({ title: "Замволення створено", color: "success" });
    emit("orderSent");
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
};

watch(
  () => state.region,
  async () => {
    if (!state.region) return;
    const { data } = await getPostOffices(state.region);
    if (!data.value) return;
    postOffices.value = data.value.map((office) => office.name);
  }
);
</script>

<template>
  <div class="flex flex-col gap-2.5 xl:w-1/2 w-full">
    <h2 class="font-bold text-[20px]">Ваші контактні дані</h2>
    <div class="flex gap-1 flex-col">
      <span class="font-bold">Email</span>
      <span>
        {{ user?.email }}
      </span>
    </div>
    <div class="flex gap-1 flex-col">
      <span class="font-bold">Ім'я</span>
      <span>
        {{ user?.name }}
      </span>
    </div>
    <h2 class="font-bold text-[20px]">Пункт видачі</h2>
    <UForm :schema="schema" :state="state" @submit="onSubmit" class="gap-2.5">
      <UFormField class="w-full" name="region"
        ><USelect
          placeholder="Обрати область"
          class="w-full text-main-400 border-b border-accent-100 aria-invalid:border-b-red-500"
          trailing-icon="custom:chevron"
          :ui="{
            base: 'rounded-none bg-transparent h-[34px] pl-0 ring-0',
            placeholder: 'w-fit text-main-400 ',
            content: 'rounded-none bg-white ring-0',
            item: 'text-main-400 hover:bg-main-400 hover:text-white before:rounded-none',
            trailing: 'pr-0',
            trailingIcon:
              'group-data-[state=open]:rotate-180 transition-transform duration-200 text-main-400 w-3 h-2.5',
          }"
          variant="none"
          v-model="state.region"
          :items="regions"
        ></USelect
      ></UFormField>
      <UFormField class="w-full" name="postOffice"
        ><USelectMenu
          class="w-full text-main-400 border-b border-accent-100 aria-invalid:border-b-red-500"
          trailing-icon="custom:chevron"
          placeholder="Обрати відділення"
          :search-input="{
            placeholder: 'Знайти відділення',
            variant: 'none',
            ui: {
              base: 'text-main-400',
            },
          }"
          color="main"
          :ui="{
            base: 'rounded-none bg-transparent h-[34px] pl-0 text-main-400 ring-0',
            placeholder: 'w-fit text-main-400 ',
            content: 'rounded-none bg-accent-50 ring-0',
            item: 'text-main-400 hover:bg-main-400 hover:text-white before:rounded-none',
            trailing: 'pr-0',
            trailingIcon:
              'group-data-[state=open]:rotate-180 transition-transform duration-200 text-main-400 w-3 h-2.5',
          }"
          variant="none"
          empty="Нічого не знайдено"
          :disabled="!state.region"
          v-model="state.postOffice"
          :items="postOffices"
        >
          <template #empty>
            <span class="text-main-400">Нічого не знайдено</span>
          </template></USelectMenu
        ></UFormField
      >
      <UButton
        class="flex justify-center"
        color="success"
        type="submit"
        :disabled="hasErrors"
        >Надіслати замовлення</UButton
      >
    </UForm>
  </div>
</template>
