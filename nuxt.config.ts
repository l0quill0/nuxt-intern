import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: false,
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
    "nuxt-google-auth",
    "nuxt-rating",
  ],
  i18n: {
    langDir: "../locales/",
    defaultLocale: "ua",
    locales: [{ code: "ua", name: "Ukrainian", file: "ua.json" }],
  },
  css: ["./assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  devServer: {
    port: 3001,
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.PUBLIC_BASE_URL,
      bucketUrl: process.env.PUBLIC_BUCKET_URL,
    },
  },
  icon: {
    customCollections: [
      {
        prefix: "custom",
        dir: "./assets/icons",
      },
    ],
  },
  ui: {
    theme: {
      colors: ["main", "success", "error"],
    },
  },
  googleAuth: {
    clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    autoLoadScript: true,
    enableServerVerify: true,
  },
});
