<script setup lang="ts">
import UpdatePasswordForm from "~/components/UpdatePasswordForm.vue";

const overlay = useOverlay();
const modal = overlay.create(UpdatePasswordForm);

const onOpenModalClick = () => {
  modal.open();
};
</script>

<template>
  <div
    class="flex pt-[50px] h-full xl:flex-row flex-col p-2.5 w-full xl:w-auto items-center xl:items-start"
  >
    <div class="flex flex-col items-center gap-2.5 bg-main-400 h-fit p-5 w-fit">
      <ProfileInfo />
      <UButton color="success" @click="onOpenModalClick"
        >Змінити пароль</UButton
      >
    </div>
    <div
      class="max-w-[1110px] w-full flex flex-col items-center pt-[30px] gap-[30px] grow h-full"
    >
      <h2 class="font-bold text-3xl">Мої замовлення</h2>
      <OrderTable />
    </div>
  </div>
</template>
