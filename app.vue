<template>
  <div class="w-full min-h-screen h-screen">
    <UApp :toaster="{ ui: { base: 'rounded-none bg-main-400' } }">
      <NuxtLayout>
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
