// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },

  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "vuetify-nuxt-module",
    "@vueuse/nuxt",
  ],

  hub: {
    database: false,
    kv: false,
    blob: false,
    cache: true,
  },

  runtimeConfig: {
    // The private keys which are only available server-side
    local: false,
    node: "",
    username: "",
    password: "",
    ca: "",
    verseIndex: "",
  },

  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },

  // Development
  devtools: { enabled: true },

  compatibilityDate: "2024-07-26",
});
