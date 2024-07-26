// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },

  // Nuxt Modules
  // https://nuxt.com/modules
  modules: ["@nuxthub/core", "@nuxt/eslint", "vuetify-nuxt-module"],

  hub: {
    database: false,
    kv: false,
    blob: false,
    cache: true,
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