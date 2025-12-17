<template>
  <div class="w-full h-screen">
    <UApp :toaster="{ ui: { base: 'rounded-none bg-[#333333]' } }">
      <NuxtLayout>
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
