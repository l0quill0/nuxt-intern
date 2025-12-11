<script setup lang="ts">
const route = useRoute();
const itemId = Number(route.params.id);
</script>

<template>
  <div class="w-full flex flex-col items-center pt-[135px]">
    <div class="max-w-[1110px] w-max flex flex-col items-center">
      <ItemInfo :id="itemId" />
    </div>
  </div>
</template>
