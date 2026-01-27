<script setup lang="ts">
import CreatePasswordForm from "~/components/CreatePasswordForm.vue";
import UpdatePasswordForm from "~/components/UpdatePasswordForm.vue";

const overlay = useOverlay();
const modal = overlay.create(UpdatePasswordForm);
const addPasswordModal = overlay.create(CreatePasswordForm);
const { user } = storeToRefs(useUserStore());
const hasPassword = computed(() =>
  user.value?.authFlow.find((m) => m === "BASIC"),
);

const onOpenModalClick = () => {
  modal.open();
};

const onCreatePassClick = () => {
  addPasswordModal.open();
};
</script>

<template>
  <div
    class="flex pt-12.5 h-full xl:flex-row flex-col p-2.5 w-full xl:w-auto items-center xl:items-start gap-4"
  >
    <div
      class="flex flex-col items-center gap-2.5 bg-main-400 p-5 sm:w-2/5 w-full"
    >
      <ProfileInfo />
      <UButton color="success" @click="onOpenModalClick" v-if="hasPassword"
        >Змінити пароль</UButton
      >
      <UButton color="success" @click="onCreatePassClick" v-else
        >Створити пароль</UButton
      >
    </div>
    <div
      class="lg:min-w-200 w-full flex flex-col items-center pt-7.5 gap-7.5 grow h-full"
    >
      <h2 class="font-bold text-3xl">Мої замовлення</h2>
      <OrderTable />
    </div>
  </div>
</template>
