<template>
  <div class="w-screen flex flex-col items-center h-full">
    <div
      class="bg-[#333333] sticky top-0 flex items-center justify-center z-10 w-full"
    >
      <NavBar />
    </div>
    <slot></slot>
  </div>
</template>
