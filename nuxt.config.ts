// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-typed-router",
    "dayjs-nuxt",
    "@nuxt/eslint",
  ],
  dayjs: {
    plugins: ["weekOfYear", "isBetween", "isoWeek"],
  },
  devtools: { enabled: true },
});
