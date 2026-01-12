<script setup lang="ts">
import { createOrder } from "~/api/orderApi";
import * as zod from "zod";
import { getPostOffices, getRegions, getSettlements } from "~/api/postApi";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps({
  hasItems: { type: Boolean, required: true },
});

const schema = zod.object({
  region: zod.number("Оберіть область"),
  settlement: zod.number("Оберіть населений пункт"),
  postOffice: zod.number("Оберіть пункт видачі"),
});

type Schema = zod.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  region: undefined,
  settlement: undefined,
  postOffice: undefined,
});

const { data: responseRegion } = await getRegions();

const regionOptions = computed(() =>
  responseRegion.value?.map((region) => ({
    label: $t(`region.${region.name}`),
    name: region.name,
    value: region.id,
  }))
);

const postOfficesOptions = ref<{ label: string; value: number }[]>([]);
const settlementOptions = ref<{ label: string; value: number }[]>([]);

const emit = defineEmits<{ (e: "orderSent"): void }>();

const toast = useToast();
const user = useUserStore().getUser();

const selectedRegion = computed(() => {
  const selected = regionOptions.value?.find(
    (reg) => reg.value === state.region
  )?.name;
  return selected;
});

const validation = computed(() => schema.safeParse(state));
const hasErrors = computed(() => !validation.value.success || !props.hasItems);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    await createOrder(event.data.postOffice);
    await refreshNuxtData("count");
    await refreshNuxtData("orderPagiantion");
    state.postOffice = undefined;
    state.region = undefined;
    state.settlement = undefined;
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
    const { data } = await getSettlements(state.region);
    if (!data.value) return;
    settlementOptions.value = data.value.map((settle) => ({
      label: $t(`${selectedRegion.value}.${settle.name}`),
      value: settle.id,
    }));
  }
);

watch(
  () => state.settlement,
  async () => {
    if (!state.settlement) return;
    const { data } = await getPostOffices(state.settlement);
    if (!data.value) return;
    postOfficesOptions.value = data.value.map((office) => ({
      label: office.name,
      value: office.id,
    }));
  }
);
</script>

<template>
  <div class="flex flex-col gap-2.5 xl:max-w-1/3 w-full">
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
        ><USelectMenu
          class="w-full text-main-400 border-b border-accent-100 aria-invalid:border-b-red-500"
          trailing-icon="custom:chevron"
          placeholder="Обрати область"
          :search-input="{
            placeholder: 'Знайти область',
            variant: 'none',
            ui: {
              base: 'text-main-400',
            },
          }"
          color="main"
          :ui="{
            base: 'rounded-none bg-transparent h-8.5 pl-0 text-main-400 ring-0',
            placeholder: 'w-fit text-main-400 ',
            content: 'rounded-none bg-accent-50 ring-0',
            item: 'text-main-400 hover:bg-main-400 hover:text-white before:rounded-none',
            trailing: 'pr-0',
            trailingIcon:
              'group-data-[state=open]:rotate-180 transition-transform duration-200 text-main-400 w-3 h-2.5',
          }"
          variant="none"
          empty="Нічого не знайдено"
          v-model="state.region"
          value-key="value"
          :items="regionOptions"
        >
          <template #empty>
            <span class="text-main-400">Нічого не знайдено</span>
          </template></USelectMenu
        ></UFormField
      >
      <UFormField class="w-full" name="settlement"
        ><USelectMenu
          class="w-full text-main-400 border-b border-accent-100 aria-invalid:border-b-red-500"
          trailing-icon="custom:chevron"
          placeholder="Обрати населений пункт"
          :search-input="{
            placeholder: 'Знайти населений пункт',
            variant: 'none',
            ui: {
              base: 'text-main-400',
            },
          }"
          color="main"
          :ui="{
            base: 'rounded-none bg-transparent h-8.5 pl-0 text-main-400 ring-0',
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
          v-model="state.settlement"
          value-key="value"
          :items="settlementOptions"
        >
          <template #empty>
            <span class="text-main-400">Нічого не знайдено</span>
          </template></USelectMenu
        ></UFormField
      >
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
            base: 'rounded-none bg-transparent h-8.5 pl-0 text-main-400 ring-0',
            placeholder: 'w-fit text-main-400 ',
            content: 'rounded-none bg-accent-50 ring-0',
            item: 'text-main-400 hover:bg-main-400 hover:text-white before:rounded-none',
            trailing: 'pr-0',
            trailingIcon:
              'group-data-[state=open]:rotate-180 transition-transform duration-200 text-main-400 w-3 h-2.5',
          }"
          variant="none"
          empty="Нічого не знайдено"
          :disabled="!state.settlement"
          v-model="state.postOffice"
          value-key="value"
          :items="postOfficesOptions"
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
